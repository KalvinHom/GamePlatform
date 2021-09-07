defmodule KalvinHom.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      KalvinHom.Repo,
      # Start the Telemetry supervisor
      KalvinHomWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: KalvinHom.PubSub},
      # Start the Endpoint (http/https)
      KalvinHomWeb.Endpoint,
      { KalvinHom.Games.GameSupervisor, []},
      { Registry, [keys: :unique, name: :game_registry]}

      # Start a worker by calling: KalvinHom.Worker.start_link(arg)
      # {KalvinHom.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: KalvinHom.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    KalvinHomWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
