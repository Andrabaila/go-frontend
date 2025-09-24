import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

class MyScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;

  constructor() {
    super('game');
  }

  preload() {
    this.load.image('sky', '/assets/sky.png'); // фон
    this.load.image('player', '/assets/player.png'); // спрайт игрока
  }

  create() {
    this.add.image(400, 300, 'sky');

    this.player = this.add.sprite(400, 300, 'player');
    this.player.setScale(0.5);

    // управление по клавиатуре
    this.input.keyboard?.on('keydown-LEFT', () => {
      this.player.x -= 10;
    });
    this.input.keyboard?.on('keydown-RIGHT', () => {
      this.player.x += 10;
    });
  }
}

export default function Game() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return; // предотвращаем повторное создание

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'phaser-container', // рендерим в этот div
      scene: MyScene,
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, []);

  return <div id="phaser-container" />;
}
