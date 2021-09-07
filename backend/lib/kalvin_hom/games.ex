defmodule KalvinHom.Games do
    alias KalvinHom.Games.{GameSupervisor, Game}
    @code_length 6

    # Generate a new game and notify socket
    def create(user) do
        code = generate_room_code()
        game = %Game{
            host: user,
            code: code,
            players: []
        }
        {:ok, _pid} = GameSupervisor.create_game(game) 
        game
        
    end

    def list do
        Supervisor.which_children(GameSupervisor)
        |> Enum.map(&Game.get_by_pid(elem(&1, 1)))
        |> IO.inspect()
    end

    def join(code, user) do
        {:reply, :player_added, game} = Game.add_player(code, user)
        game
    end

    def delete() do
    end

    defp generate_room_code() do
        :crypto.strong_rand_bytes(@code_length) |> Base.url_encode64 |> binary_part(0, @code_length)
    end
  

   

end
