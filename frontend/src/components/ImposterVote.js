import React from "react";
import { Stack, Heading, RadioGroup, Radio } from "@chakra-ui/react";
import ReactTimerStopwatch from 'react-stopwatch-timer';

function ImposterVote({game: game, ...rest}) {
    const [imposter, setValue] = React.useState(null)
    if(game.round < 3) return null;
    const fromTime = new Date(0, 0, 0, 0, 1, 0, 0);

    return(
        <div>
             
        
        <Stack direction="column" align="center" {...rest}>
            <Heading size="lg"> Who was the imposter?</Heading>
            <RadioGroup onChange={setValue} value={imposter}>
                <Stack direction="column">
                  {game.players.map(player => <Radio key={player.uuid} size="lg" value={player.uuid}>{player.username}</Radio>) }
                </Stack>
              </RadioGroup>
            
            )
          
          </Stack>
          </div>
    )
}

export default ImposterVote;