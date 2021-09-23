defmodule KalvinHom.Games.Game do
  @moduledoc """
  Used to store the state of a game.
  Consists of the struct and genserver calls to update
  """
  use GenServer
  alias KalvinHom.Games.{Game, WordPacks}
  
  @new_game :new
  @in_progress :in_progress
  @completed :completed

  @derive Jason.Encoder
  defstruct host: nil,
            code: nil,
            players: [],
            game_state: @new_game,
            current_player: nil,
            round: 0,
            total_rounds: 2,
            imposter: nil,
            theme: nil,
            word: nil,
            turn: 0


  def get(code) do
    code
    |> via_tuple()
    |> GenServer.call(:game)
  end

  def get_by_pid(pid) do
    GenServer.call(pid, :game)
  end

  def add_player(room, player) do
    room
    |> via_tuple()
    |> GenServer.call({:add_player, player})
  end

  def remove_player(room, player) do
    GenServer.call(via_tuple(room), {:remove_player, player})
  end

  def next_turn(code) do
    code
    |> via_tuple()
    |> GenServer.call(:next_turn)
      
  end

  def start(room) do
    room
    |> via_tuple()
    |> GenServer.call({:start_game, {}})
  end

  def end_game(room) do
    GenServer.call(room, {:end_game, {}})
  end

  def restart_game(room) do
    GenServer.call(room, {:restart_game, {}})
  end

  def handle_call(:next_turn, _from, game) do
        game = 
          game
          |> increment_player
       
      {:reply, game, game}
  end


  def handle_call({:start_game, _}, _from, state) do

    theme = WordPacks.get_random_theme()
    word = WordPacks.get_random_word(theme) |> IO.inspect()
    players = Enum.shuffle(state.players)
    
    game =  
      state
      |> Map.put(:game_state, @in_progress)
      |> Map.put(:imposter, Enum.random(state.players)) # assign random user as the imposter
      |> Map.put(:players, players)
      |> Map.put(:current_player, Enum.at(players, 0))
      |> Map.put(:theme, theme)      
      |> Map.put(:word, word) 
      |> Map.put(:round, 1) 
      |> Map.put(:turn, 1)
        
    {:reply, game, game}
  end

  def handle_call(:game, _from, game) do
    {:reply, game, game}
  end

  def handle_call({:add_player, player}, _from, state) do
    state = Map.update!(state, :players, &[player | &1])
    {:reply, state, state}
  end

  def handle_call({:remove_player, player}, _from, state) do
    state = Map.update!(state, :players, &Enum.reject(&1, fn p -> p["username"] == player["username"] end))
    {:reply, state, state}
  end



  defp increment_player(game) do
    turn = game.turn + 1

    next_player_idx = rem(turn - 1, Enum.count(game.players))
    next_player = Enum.at(game.players, next_player_idx)
   
    next_round =
      case next_player_idx do
        0 -> game.round + 1
        _ -> game.round
      end
    
    total_rounds = game.total_rounds
    next_player = 
      case next_round do
       n when n > total_rounds  -> nil
        _ -> next_player
      end
    
    game
    |> Map.put(:turn, turn)
    |> Map.put(:round, next_round)
    |> Map.put(:current_player, next_player)
  end



  # GenServer required functions
  @impl true
  def start_link(name) do
    GenServer.start_link(__MODULE__, name, name: via_tuple(name.code))
  end

  @impl true
  def child_spec(game) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [game]},
      restart: :transient
    }
  end
  @impl true
  def init(game) do
    {:ok, game}
  end

  def stop(process_name, stop_reason) do
    process_name |> via_tuple() |> GenServer.stop(stop_reason)
  end

  defp via_tuple(name),
    do: {:via, Registry, {:game_registry, name}}
end
