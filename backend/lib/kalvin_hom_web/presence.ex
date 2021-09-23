defmodule KalvinHomWeb.Presence do
    use Phoenix.Presence,
      otp_app: :kalvin_hom,
      pubsub_server: KalvinHom.PubSub
  end
  