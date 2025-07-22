---
title: "Robot Operating System, MoveIt2 & Gazebo Simulation"
excerpt: "A collection of projects involving ROS2-based robotic control, motion planning using MoveIt2, and simulation in Gazebo. These works showcase my skills in building, controlling, and simulating intelligent robotic systems using real-time data, custom URDF models, and autonomous task execution.<br/><img src='/images/ros2_moveit2.jpg'>"
collection: portfolio
---

Here are a few of my collection of projects:

<style>
.design-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 2rem;
}
.design-section img {
  max-width: 45%;
  border-radius: 10px;
  margin-right: 5%;
}
.design-section .desc {
  flex: 1;
  min-width: 250px;
}
@media (max-width: 1000px) {
  .design-section {
    flex-direction: column;
  }
  .design-section img {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 1rem;
  }
}
</style>

<!-- ✅ Project 1 -->
<div class="design-section">
  <a href="/_portfolio/two_bar_arm.md/">
    <img src="/images/drill_mechanism.png" alt="Vehicle-Mounted Two-Bar Arm (MoveIt2 + RViz2)">
  </a>
  <div class="desc">
    <h3>
      <a href="/portfolio/two_bar_arm.md/">
        🚗 Vehicle-Mounted Two-Bar Arm (MoveIt2 + RViz2)
      </a>
    </h3>
    <ul>
      <li>Designed a two-link robotic arm in SolidWorks, converted it to a URDF model, and performed path planning using MoveIt2 and RViz2.</li>
      <li>Modeled the robot parts in SolidWorks and exported the model to URDF using a URDF exporter.</li>
      <li>Set up a complete MoveIt2 configuration, including SRDF, kinematics, planning groups, and controllers.</li>
      <li>Simulated motion planning and trajectory execution in RViz2 using MoveIt2 tools and ROS2 launch files.</li>
      <li>Successfully demonstrated joint-space motion planning with real-time visual feedback in RViz2 — covering robot modeling, configuration, and planning pipeline setup.</li>
    </ul>
  </div>
</div>

<!-- ✅ Project 2 (Example for next one) -->
<div class="design-section">
  <a href="/portfolio/mobile_robot_gazebo.md/">
    <img src="/images/air_craft_design.png" alt="Mobile Robot Simulation in ROS2 & Gazebo">
  </a>
  <div class="desc">
    <h3>
      <a href="/portfolio/mobile-robot-arm-gazebo/">
        🤖 Mobile Robot Simulation in ROS2 & Gazebo
      </a>
    </h3>
    <ul>
      <li>Built a differential-drive mobile robot from scratch and simulated it in Gazebo with arm and sensors.</li>
      <li>Used XACRO and URDF for model generation, setup ROS2 nodes, and RViz2 visualization.</li>
      <li>Implemented ROS2 launch files, transformations, and control plugins to achieve full simulation and testing.</li>
    </ul>
  </div>
</div>


