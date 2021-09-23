defmodule KalvinHomWeb.GameController do
    use KalvinHomWeb, :controller
    alias KalvinHomWeb.{GamesChannel, GameChannel}
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

    def start(conn, %{"code" => code}) do
        game = Games.start(code)
        GameChannel.broadcast_start_game(game)
        json(conn, game)
    end
        

 
end