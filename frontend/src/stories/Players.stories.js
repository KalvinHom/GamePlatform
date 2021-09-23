import React from 'react';

import Players from '../components/Players';

export default {
  title: 'ImposterArtist/Players',
  component: Players,
};

const Template = (args) => <Players {...args} />;

export const PlayerList = Template.bind({});
PlayerList.args = {
  game: {
      players: [
          {uuid: 1, username: "kalvin"},
          {uuid: 2, username: "mocha"}
      ],
      current_player: {uuid: 1, username: "kalvin"}
  },
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
