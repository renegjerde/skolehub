-- SkoleHub / KaffeStatus: shared anonymous status board
-- Run this once in Supabase Dashboard -> SQL Editor.
-- Only status codes and server-generated timestamps are stored. No names, user IDs or notes.

create table if not exists public.coffee_status (
  id smallint primary key check (id = 1),
  status text not null check (status in ('FRESH', 'YES', 'NO')),
  updated_at timestamptz not null default now()
);

create table if not exists public.coffee_status_history (
  id uuid primary key default gen_random_uuid(),
  status text not null check (status in ('FRESH', 'YES', 'NO')),
  created_at timestamptz not null default now()
);

insert into public.coffee_status (id, status, updated_at)
values (1, 'YES', now())
on conflict (id) do nothing;

alter table public.coffee_status enable row level security;
alter table public.coffee_status_history enable row level security;

-- Browser clients may only read the shared board. All writes go through the RPC below.
revoke all on public.coffee_status from public, anon, authenticated;
revoke all on public.coffee_status_history from public, anon, authenticated;
grant select on public.coffee_status to anon;
grant select on public.coffee_status_history to anon;

drop policy if exists "Public can read current coffee status" on public.coffee_status;
create policy "Public can read current coffee status"
  on public.coffee_status for select to anon using (true);

drop policy if exists "Public can read coffee status history" on public.coffee_status_history;
create policy "Public can read coffee status history"
  on public.coffee_status_history for select to anon using (true);

create or replace function public.set_coffee_status(p_status text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_now timestamptz;
begin
  if p_status is null or p_status not in ('FRESH', 'YES', 'NO') then
    raise exception 'Invalid coffee status';
  end if;

  -- Serialize simultaneous clicks so the current status and history stay ordered.
  perform 1 from public.coffee_status where id = 1 for update;
  v_now := clock_timestamp();

  insert into public.coffee_status_history (status, created_at)
  values (p_status, v_now);

  update public.coffee_status
     set status = p_status,
         updated_at = v_now
   where id = 1;

  -- Keep a compact history; the interface only displays the latest eight updates.
  delete from public.coffee_status_history
   where id not in (
     select id from public.coffee_status_history
      order by created_at desc, id desc
      limit 8
   );
end;
$$;

revoke all on function public.set_coffee_status(text) from public, authenticated;
grant execute on function public.set_coffee_status(text) to anon;

-- Enable Realtime for the single current-status row.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
     where pubname = 'supabase_realtime'
       and schemaname = 'public'
       and tablename = 'coffee_status'
  ) then
    alter publication supabase_realtime add table public.coffee_status;
  end if;
end $$;
