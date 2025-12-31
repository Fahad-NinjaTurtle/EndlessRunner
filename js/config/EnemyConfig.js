const EnemyConfig = {
    slime: {
      key: 'slime_normal_walk_a',
      type: 'ground',
      speed: 220,
      yOffset: 0
    },
    snail: {
      key: 'snail_walk_a',
      type: 'ground',
      speed: 180,
      yOffset: 0
    },
    bee: {
      key: 'bee_a',
      type: 'flying',
      speed: 250,
      yOffset: -120  // Bee flies 80 pixels above ground
    },
    fly: {
      key: 'fly_a',
      type: 'flying',
      speed: 280,
      yOffset: -120  // Fly also in the air, slightly lower than bee
    },
    saw: {
      key: 'saw_a',
      type: 'hazard',
      speed: 300,
      yOffset: 0
    },
    slime_spike: {
      key: 'Slime_Spike_a',
      type: 'ground',
      speed: 220,
      yOffset: 0
    }
  };
  
  window.EnemyConfig = EnemyConfig;
  