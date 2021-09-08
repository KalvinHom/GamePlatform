defmodule KalvinHom.Games do
    alias KalvinHom.Games.{GameSupervisor, Game}
    @code_length 6

    # Generate a new game and notify socket
    def create(user) do
        code = generate_room_code()
        game = %Game{
            host: user,
            code: code,
            players: [user]
        }
        {:ok, _pid} = GameSupervisor.create_game(game) 
        game
        
    end

    def list do
        Supervisor.which_children(GameSupervisor)
        |> Enum.map(&Game.get_by_pid(elem(&1, 1)))
        |> IO.inspect()
    end
    
    def get(code) do
        Game.get(code)
    end


    def join(code, user) do
        Game.add_player(code, user)
    end

    def leave(code, user) do
        Game.remove_player(code, user)
    end

    def start(code) do
        Game.start(code)
    end
    
    def delete() do
    end

    defp generate_room_code() do
        :crypto.strong_rand_bytes(@code_length) |> Base.url_encode64 |> binary_part(0, @code_length)
    end
  

   

end
