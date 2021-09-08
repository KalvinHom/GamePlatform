import React, { useRef, useEffect, useContext } from "react";
import { Socket } from "phoenix";
import UserContext from "../contexts/UserContext"
import "./whiteboard.scss";
import socket from "../socket";

const Board = ({game: game, channel: channel}) => {
    const canvasRef = useRef(null);
    const colorsRef = useRef(null);
    const testRef = useRef(null);
    const { user } = useContext(UserContext)
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
        let drawing = false;

        // ------------------------------- create the drawing ----------------------------

        const drawLine = (x0, y0, x1, y1, color, emit) => {
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
        };

        // ---------------- mouse movement --------------------------------------

        const onMouseDown = (e) => {
            const rect = canvas.getBoundingClientRect();
            drawing = true;
            current.x = (e.clientX || e.touches[0].clientX) - rect.left;
            current.y = (e.clientY || e.touches[0].clientY) - rect.top;
        };

        const onMouseMove = (e) => {
            if (!drawing) { return; }
            const rect = canvas.getBoundingClientRect();

            drawLine(current.x, current.y, (e.clientX || e.touches[0].clientX) - rect.left, (e.clientY || e.touches[0].clientY) - rect.top, current.color, true);
            current.x = (e.clientX || e.touches[0].clientX) - rect.left;
            current.y = (e.clientY || e.touches[0].clientY) - rect.top;
        };

        const onMouseUp = (e) => {
            if (!drawing) { return; }
            drawing = false;
            const rect = canvas.getBoundingClientRect();

            drawLine(current.x, current.y, (e.clientX || e.touches[0].clientX) - rect.left, (e.clientY || e.touches[0].clientY) - rect.top, current.color, true);
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
    }, []);

    // ------------- The Canvas and color elements --------------------------
    console.log(user);
    return (
        <div>
            <div className="container">               
             <canvas ref={canvasRef} className="whiteboard" />
            </div>

            <div ref={colorsRef} className="colors">
                <div className="color black" />
                <div className="color red" />
                <div className="color green" />
                <div className="color blue" />
                <div className="color yellow" />
            </div>
        </div>
    );
};

export default Board;