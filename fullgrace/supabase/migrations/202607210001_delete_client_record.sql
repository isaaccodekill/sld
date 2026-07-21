create or replace function public.delete_client_record(target_client_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only an authorised admin can delete clients.';
  end if;

  update public.enquiries
  set promoted_to_client_id = null
  where promoted_to_client_id = target_client_id;

  delete from public.report_sections
  where report_id in (select id from public.reports where client_id = target_client_id);

  delete from public.session_notes where client_id = target_client_id;
  delete from public.appointments where client_id = target_client_id;
  delete from public.reports where client_id = target_client_id;
  delete from public.clients where id = target_client_id;

  if not found then
    raise exception 'Client not found.';
  end if;
end;
$$;

grant execute on function public.delete_client_record(uuid) to authenticated;
