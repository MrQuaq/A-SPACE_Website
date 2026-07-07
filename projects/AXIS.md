# AXIS — Balancing robot

AXIS is a dual wheeled self-balancing robot built around an ESP32 and custom PCB!

## Project overview

AXIS is a dual wheeled balancing robot, using a PID algorithm to keep its balance. The main microcontroller of the robot will be the ESP32. This enables the use of an Xbox controller for controlling the robot. Certain buttons on the controller will be mapped to the pid value settings so they can be changed on the fly, which should make the tuning process a lot easier.

As an additional feature that will be tested after the robot is already stable, 2 encoders that are already mounted on the motors will be added. Their data will be used in a second PID algorithm to hopefully get the robot to stay in a single place a lot easier. This feature is still completely optional and can easily be turned on by a button on the Xbox controller

## Goals

The goal of this project is to become more familiarized with electronics to get a good foundation for future projects. And to grasp the basics of PCB-design.

The goal for the robot itself is to make it balance without jittering too much and to make it drivable via a controller.

## Key components
- custom PCB to mount breakout boards on
- 3D-printed frame
- custom code featuring a PID algorithm and bluetooth connection

## PCB design

<img width="1066" height="673" alt="Schermafbeelding 2026-06-16 212549" src="https://github.com/user-attachments/assets/5afa3468-d90f-439a-9ea0-67055f8f289d" />This PCB features lots of female header pins to mount existing breakout boards onto.This framework makes for more reliable connections, pcb-design experience.
To design the board I used KiCAD, a free open-source EDA.

The first step in the design process was coming up with the requirements and features of  the board.
These include:
- measuring the robots angle reliably
- driving the motors
- being able to connect a small lcd display for easier status updates and eventually PID tuning
- accept power from a 7,2V NiMH battery
- have connectors for encoders

After setting these requirements, a schematic was designed before moving on to the actual tracing. This also enabled me to become even more familiarized with the design and the components.

With the schematic made, the pcb tracing was fairly easy. I paid special attention to the spacing between the female pin headers so the modules would fit properly. A ground plane was also added on the bottom of the PCB to make wiring easier. To disturb this plane as little as possible, I tried to layout the PCB in such a way that I have almost no traces on the back side.
The final PCB features:
- headers for ESP32
- headers for IMU module (ICM20948)
- headers for motor driver (tb6612fng)
- headers for lcd display
- screw terminals for motors and encoders
- components to provide the right (and stable) voltages to all components
- protection components