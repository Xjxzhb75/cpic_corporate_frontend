create or replace trigger tri_jkxdept 
  before insert
  on jkxdept 
  for each row
declare
  -- local variables here
begin
 select SEQ__JKXDEPT_ID.Nextval into:new.id from dual;
end tri_jkxdept ;
/
