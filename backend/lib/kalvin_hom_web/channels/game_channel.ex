defmodule KalvinHomWeb.GameChannel do
    use KalvinHomWeb, :channel
    alias KalvinHom.Games
    alias KalvinHomWeb.GamesChannel
    
    @impl true
    def join("game:"<>code, %{"user" => user}, socket) do
      if authorized?(user) do
        game = Games.join(code, user)
        IO.inspect(game)
        broadcast_new_player(game)
        socket = 
            socket
            |> assign(:current_game, code)
            |> assign(:user, user)
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

    def handle_in("complete_turn", payload, socket) do
      game = Games.next_turn(socket.assigns.current_game)
      IO.inspect("broadcasting next turn")
      IO.inspect(game)
      broadcast socket, "next_turn", game
      {:noreply, socket}

    end
    def terminate(reason, socket) do
        #if it's game_summary, don't need to leave game
        if String.starts_with?(socket.topic, "game:") do
          end_socket(socket)
        end
        {:stop, reason}
    end

    @impl true
    def handle_in("player_left", payload, socket) do
        game = Games.leave(socket.assigns.current_game, payload)
        IO.inspect("player left")
        IO.inspect(game)
        case game do
            nil ->         KalvinHomWeb.Endpoint.broadcast! "games:lobby", "refresh_games", %{games: Games.list}

            g -> broadcast_player_left(g)
        end
        assign(socket, :current_game, nil)

        {:noreply, socket}
    end

    def broadcast_player_left(game) do
        KalvinHomWeb.Endpoint.broadcast! "game:#{game.code}", "player_left", game
        KalvinHomWeb.Endpoint.broadcast! "game_summary:#{game.code}", "player_left", game
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
  
    defp end_socket(socket) do
      case Enum.count(Registry.lookup(:game_registry, socket.assigns.current_game)) do
        0 -> nil
        _ ->
          game = Games.leave(socket.assigns.current_game, socket.assigns.user)
          broadcast_player_left(game)
      end
    end


    # Add authorization logic here as required.
    defp authorized?(_payload) do
      true
    end
  end
  