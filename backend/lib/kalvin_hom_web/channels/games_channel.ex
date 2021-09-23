defmodule KalvinHomWeb.GamesChannel do
    use KalvinHomWeb, :channel
    alias KalvinHom.Games
    @impl true
  
    def join("games:lobby", payload, socket) do
      if authorized?(payload) do
        # broadcast_from socket, "new_user", payload
        assign(socket, :user, payload["name"])
        {:ok, %{games: Games.list()}, assign(socket, :user, payload)
      }
      else
        {:error, %{reason: "unauthorized"}}
      end
    end
  
    def broadcast_new_game(game) do
      KalvinHomWeb.Endpoint.broadcast! "games:lobby", "new_game", game
    end

    def broadcast_refresh() do
      IO.inspect("REFRESHING GAMES")
      KalvinHomWeb.Endpoint.broadcast! "games:lobby", "refresh_games", "test"
    end


    # Channels can be used in a request/response fashion
    # by sending replies to requests from the client
    @impl true
    def handle_in("ping", payload, socket) do
      {:reply, {:ok, payload}, socket}
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
  