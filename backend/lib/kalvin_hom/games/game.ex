defmodule KalvinHom.Games.Game do
  @moduledoc """
  Used to store the state of a game.
  Consists of the struct and genserver calls to update
  """
  use GenServer

  alias KalvinHom.Game
  @new_game :new
  @in_progress :in_progress
  @completed :completed

  @derive Jason.Encoder
  defstruct host: nil,
            code: nil,
            players: [],
            game_state: @new_game

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

  def handle_call({:start_game, _}, _from, state) do
    game =  Map.put(state, :game_state, @in_progress)
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
    state = Map.update!(state, :players, &Enum.reject(&1, fn p -> p.username == player.username end))
    {:reply, state, state}
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
