defmodule KalvinHomWeb.GameController do
    use KalvinHomWeb, :controller
    alias KalvinHomWeb.GamesChannel
    alias KalvinHom.Games
    @code_length 6
    def create(conn, %{"user" => user}) do
        game = Games.create(user)
        #notify socket of new game
        GamesChannel.broadcast_new_game(game)
        json(conn, game)
    end

    def list(conn, _params) do
        games = Games.list()
        json(conn, games)
    end

    def join(conn, %{"user" => user, "code" => code}) do
        Games.join(code, user)
    end
        

 
end