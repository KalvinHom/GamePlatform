defmodule KalvinHomWeb.ChatRoomChannel do
  use KalvinHomWeb, :channel
  alias KalvinHom.Game
  @impl true
  def join("chat_room:" <> id, payload, socket) do
    if authorized?(payload) do
      Game.add_player(id, "test")
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  @impl true
  def handle_in("drawing", payload, socket) do
    IO.inspect("got drawing")
    broadcast_from socket, "drawing", payload
    {:noreply, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (chat_room:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
