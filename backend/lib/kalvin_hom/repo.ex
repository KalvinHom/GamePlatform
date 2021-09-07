defmodule KalvinHom.Repo do
  use Ecto.Repo,
    otp_app: :kalvin_hom,
    adapter: Ecto.Adapters.Postgres
end
