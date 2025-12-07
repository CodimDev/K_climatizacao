-- Enums
create type role_enum as enum ('admin', 'tecnico');
create type user_status_enum as enum ('ativo', 'inativo');
create type service_type_enum as enum (
  'preventiva','corretiva','instalacao','higienizacao','desinstalacao','carga_gas','outros'
);
create type priority_enum as enum ('baixa','normal','alta','urgente');
create type stock_category_enum as enum ('gas','pecas','ferramentas','consumiveis','eletricos','outros');
create type unit_enum as enum ('un','m','kg','l','rolo','cx');
create type appointment_status_enum as enum ('pendente','confirmado','concluido','cancelado');
create type movement_type_enum as enum ('entrada','saida');
create type financial_type_enum as enum ('entrada','saida');
create type financial_category_enum as enum ('servico','pecas','combustivel','ferramentas','manutencao','salario','outros');
create type payment_method_enum as enum ('pix','dinheiro','cartao_credito','cartao_debito','transferencia');

