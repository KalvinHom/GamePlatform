defmodule KalvinHomWeb.GameChannel do
    use KalvinHomWeb, :channel
    alias KalvinHom.Games
  
    @impl true
    def join("game:"<>code, payload, socket) do
      if authorized?(payload) do
        game = Games.get(code)
        # broadcast_from socket, "user_joined", game
        {:ok, game, socket}
      else
        {:error, %{reason: "unauthorized"}}
      end
    end

    def join("game_summary:"<>code, payload, socket) do
        if authorized?(payload) do
            game = Games.get(code)
            # broadcast_from socket, "user_joined", game
          {:ok, game, socket}
        else
          {:error, %{reason: "unauthorized"}}
        end
    end

    @impl true
    def handle_in("update_game_state", payload, socket) do
      IO.inspect("got drawing")
      broadcast_from socket, "update_game_state", payload
      {:noreply, socket}
    end

    def broadcast_new_player(game) do
        KalvinHomWeb.Endpoint.broadcast! "game:#{game.code}", "player_joined", game
        KalvinHomWeb.Endpoint.broadcast! "game_summary:#{game.code}", "player_joined", game
    end

    def broadcast_start_game(game) do
        KalvinHomWeb.Endpoint.broadcast! "game:#{game.code}", "game_started", game
        KalvinHomWeb.Endpoint.broadcast! "game_summary:#{game.code}", "game_started", game
    end
    # Channels can be used in a request/response fashion
    # by sending replies to requests from the client
  
  
    # Add authorization logic here as required.
    defp authorized?(_payload) do
      true
    end
  end
  