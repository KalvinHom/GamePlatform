import React from 'react';

import ImposterVote from '../components/ImposterVote';

export default {
  title: 'ImposterArtist/ImposterVote',
  component: ImposterVote,
};

const Template = (args) => <ImposterVote {...args} />;

export const Radios = Template.bind({});
Radios.args = {
  game: {
      players: [
          {uuid: 1, username: "kalvin"},
          {uuid: 2, username: "mocha"}
      ],
      current_player: {uuid: 1, username: "kalvin"}
  },
};

