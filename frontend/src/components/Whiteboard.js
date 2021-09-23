import React, { useRef, useEffect, useContext, useState, useCallback } from "react";
import { Socket } from "phoenix";
import { Box } from "@chakra-ui/react";
import UserContext from "../contexts/UserContext"
import "./whiteboard.scss";
import socket from "../socket";

const Board = ({game: game, channel: channel}) => {
    const canvasRef = useRef(null);
    const colorsRef = useRef(null);


    const { user } = useContext(UserContext)

    const drawLine = useCallback((x0, y0, x1, y1, color, emit) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color;
        context.lineWidth = 4;
        context.stroke();
        context.closePath();

        if (!emit) { return; }
        const w = canvas.width;
        const h = canvas.height;
        console.log("drawing")
        console.log(w);
        console.log(h);
        console.log(channel);
        channel.push('update_game_state', {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color,
        });
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.height = canvas.width * .8;
       


        const colors = document.getElementsByClassName('color');
        console.log(colors, 'the colors');
        // set the current color
        const current = {
            color: 'black',
        };

        // helper that will update the current color
        const onColorUpdate = (e) => {
            current.color = e.target.className.split(' ')[1];
        };

        // loop through the color elements and add the click event listeners
        for (let i = 0; i < colors.length; i++) {
            colors[i].addEventListener('click', onColorUpdate, false);
        }
     

        // ------------------------------- create the drawing ----------------------------

       

        const onResize = () => {
            console.log("resizing");
            canvas.width = window.innerWidth*.7;
            canvas.height = canvas.width * .6;
         
        };

        // window.addEventListener('resize', onResize, false);
        onResize();

        // ----------------------- socket.io connection ----------------------------
        const onDrawingEvent = (data) => {
            console.log("got drawing event")
            const w = canvas.width;
            const h = canvas.height;
            drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
        }
        channel.on('update_game_state', onDrawingEvent);
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const current = {
            color: 'black',
        };

        let drawing = false;
        let drawn = false;

        // ---------------- mouse movement --------------------------------------

        const onMouseDown = (e) => {
            console.log(game)
            if (!drawn && game.round < 3 && !!game.current_player && game.current_player.uuid == user.uuid) {
                const rect = canvas.getBoundingClientRect();
                drawing = true;

                
                const mouseX = (e.pageX || e.touches[0].pageX) - rect.left;
                const mouseY = (e.pageY || e.touches[0].pageY) - rect.top;

                current.x = mouseX * canvas.width / canvas.clientWidth;
                current.y = mouseY * canvas.height / canvas.clientHeight;

            }
        };

        const onMouseMove = (e) => {
            if (!drawing) { return; }
            const rect = canvas.getBoundingClientRect();

            const mouseX = (e.pageX || e.touches[0].pageX) - rect.left;
            const mouseY = (e.pageY || e.touches[0].pageY) - rect.top;

            const canvasX = mouseX * canvas.width / canvas.clientWidth;
            const canvasY = mouseY * canvas.height / canvas.clientHeight;
            drawLine(current.x, current.y, canvasX, canvasY, current.color, true);
            current.x = canvasX;
            current.y = canvasY;
        };  

        const onMouseUp = (e) => {
            if (!drawing) { return; }
            drawing = false;
            drawn = true;
            const rect = canvas.getBoundingClientRect();

            const mouseX = (e.pageX || e.touches[0].pageX) - rect.left;
            const mouseY = (e.pageY || e.touches[0].pageY) - rect.top;

            const canvasX = mouseX * canvas.width / canvas.clientWidth;
            const canvasY = mouseY * canvas.height / canvas.clientHeight;
            drawLine(current.x, current.y, canvasX, canvasY, current.color, true);
            current.x = canvasX;
            current.y = canvasY;
            channel.push('complete_turn', {})
        };

        // ----------- limit the number of events per second -----------------------

        const throttle = (callback, delay) => {
            let previousCall = new Date().getTime();
            return function () {
                const time = new Date().getTime();

                if ((time - previousCall) >= delay) {
                    previousCall = time;
                    callback.apply(null, arguments);
                }
            };
        };

        // -----------------add event listeners to our canvas ----------------------

        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseUp, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

        // Touch support for mobile devices
        canvas.addEventListener('touchstart', onMouseDown, false);
        canvas.addEventListener('touchend', onMouseUp, false);
        canvas.addEventListener('touchcancel', onMouseUp, false);
        canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

        // -------------- make the canvas fill its parent component -----------------

     
    }, [game]);

    // ------------- The Canvas and color elements --------------------------
    return (
        <Box maxHeight="50vh">
            <canvas style={{maxHeight: "60vh"}} ref={canvasRef} className="whiteboard" />
        </Box>
    );
};

export default Board;