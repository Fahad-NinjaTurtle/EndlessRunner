const GameConfig = {
    Game_Width: "100%",
    Game_Height: "100%",

    Player:{
        Gravity: 1500,
        Jump_Force: -700,
        Run_Speed: 200,
        Start_X: 100,
        Start_Y: 400,
        Scale: 1,
    },

    Parallax:{
        Layer_1_Speed: 100,
        Layer_2_Speed: 200,
        Layer_3_Speed: 300,
    },

    Obstacle:{
        Spawn_Interval_Min: 1500,
        Spawn_Interval_Max: 3000,
        Speed: 200,
        Scale: 1,
    },

    Score:{
        Points_Per_Obstacle: 10,
    },

    Difficulty:{
        Increase_Interval: 30000,
        Speed_Multiplier: 1.1,
        Spawn_Rate_Multiplier: 0.9,
    },

    Ground:{
        Y_Position: 500,
        Height: 100,
    },

    Colors:{
        BACKGROUND: '#87CEEB',      // Sky blue
        TEXT: '#FFFFFF',
        UI_BACKGROUND: 'rgba(0, 0, 0, 0.5)'
    },

    Enemy:{
        Spawn_Interval: 3000,
    },

};

window.GameConfig = GameConfig;