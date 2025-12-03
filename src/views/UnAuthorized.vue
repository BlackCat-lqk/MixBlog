<template>
  <div class="unauthorized">
    <div class="gandalf">
      <div class="fireball"></div>
      <div class="skirt"></div>
      <div class="sleeves"></div>
      <div class="shoulders">
        <div class="hand left"></div>
        <div class="hand right"></div>
      </div>
      <div class="head">
        <div class="hair"></div>
        <div class="beard"></div>
      </div>
    </div>
    <div class="message">
      <h1>403 - You Shall Not Pass</h1>
      <p>
        Uh oh, Gandalf is blocking the way!<br />Maybe you have a typo in the url? Or you meant to
        go to a different location? Like...Hobbiton?
      </p>
      <p>你无权访问！</p>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.unauthorized {
  text-align: center;
  margin-top: 100px;
  $black: #000;
  $semi-black: #1a2130;
  $white: #fff;
  $dress: #ededed;
  $sword: #e6e6e6;
  $staff: #bf5507;
  $skin: #ffd8ad;
  $hair: #c2beb5;
  $lips: pink;
  $fire: black, #6c1305, #de8531, #efac41;
  $fire-reverse: #efac41, #de8531, #6c1305, black;

  @keyframes floating {
    to {
      top: 1.5rem;
    }
  }

  body {
    background-color: $black;
    color: $white;
    text-align: center;
    font-size: 1.3rem;
    h1 {
      font-size: 2.5rem;
    }
  }

  .message {
    max-width: 700px;
    margin: 5rem auto 0 auto;
    color: var(--text-color);
  }

  .gandalf {
    position: relative;
    width: 400px;
    height: 400px;
    margin: 0 auto;
    top: 1rem;
    animation: floating 1s infinite alternate ease-in-out;
    div {
      position: absolute;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 400px;
      height: 400px;
      background-color: $semi-black;
      border-radius: 50%;
    }
    .fireball {
      bottom: -10px;
      left: 50px;
      width: 300px;
      height: 100px;
      border-radius: 50%;
      background: radial-gradient($fire-reverse);
      border: 5px solid $black;
    }
    .skirt {
      bottom: 50px;
      left: 100px;
      border-bottom: 230px solid $dress;
      border-left: 100px solid transparent;
      border-right: 100px solid transparent;

      &::before {
        content: '';
        position: absolute;
        background-color: $dress;
        width: 100px;
        height: 21px;
        top: 230px;
        left: 0px;
        border-bottom-right-radius: 180%;
        border-bottom-left-radius: 100%;
      }
      &::after {
        content: '';
        position: absolute;
        background-color: $dress;
        width: 100px;
        height: 28px;
        top: 230px;
        left: -100px;
        border-bottom-right-radius: 80%;
        border-bottom-left-radius: 180%;
      }
    }
    .sleeves {
      &::before,
      &::after {
        // sleeves
        content: '';
        position: absolute;
        border-bottom: 70px solid $dress;
      }
      &::before {
        // sleeve left
        top: 130px;
        left: 191px;
        border-left: 100px solid transparent;
        border-right: 40px solid transparent;
        transform: rotate(-34deg);
      }
      &::after {
        // sleeve right
        top: 127px;
        left: 70px;
        border-left: 40px solid transparent;
        border-right: 100px solid transparent;
        transform: rotate(41deg);
      }
    }
    .shoulders {
      background-color: $dress;
      border-radius: 50%;
      width: 100px;
      height: 130px;
      left: 150px;
      top: 120px;
      .hand {
        width: 33px;
        height: 26px;
        border-radius: 50%;
        background-color: $skin;
        top: -6px;
      }
      .left {
        left: -70px;
        transform: rotate(-20deg);
        &::after {
          // sword
          content: '';
          position: absolute;
          background-color: #e6e6e6;
          width: 126px;
          height: 8px;
          border-radius: 4px;
          transform: rotate(-105deg);
          transform-origin: bottom;
          top: -48px;
          left: -56px;
        }
      }
      .right {
        right: -70px;
        transform: rotate(20deg);
        &::after {
          // staff
          content: '';
          position: absolute;
          background-color: $staff;
          width: 250px;
          height: 5px;
          border-radius: 2.5px;
          transform: rotate(-78deg);
          transform-origin: left;
          bottom: -100px;
          left: 0;
        }
      }
    }
    .head {
      width: 80px;
      height: 90px;
      top: 80px;
      left: 160px;
      background-color: #ffd8ad;
      border-radius: 50%;

      &::before,
      &::after {
        // eyes
        content: '';
        position: absolute;
        background-color: $black;
      }

      &::before {
        width: 13px;
        height: 5px;
        border-radius: 3px;
        top: 42px;
        left: 22px;
        transform: rotate(19deg);
      }
      &::after {
        width: 13px;
        height: 5px;
        border-radius: 3px;
        top: 42px;
        right: 22px;
        transform: rotate(-19deg);
      }

      .hair {
        width: 70px;
        height: 30px;
        background-color: $hair;
        border-radius: 50%;
        top: 0px;
        left: 5px;

        &::before,
        &::after {
          // hair sides
          content: '';
          position: absolute;
          background-color: $hair;
        }

        &::before {
          // hair left
          top: 13px;
          left: -16px;
          width: 25px;
          height: 100px;
          border-top-left-radius: 34px;
          border-top-right-radius: 15px;
          border-bottom-left-radius: 100px;
          border-bottom-right-radius: 20px;
          transform: rotate(8deg);
        }
        &::after {
          // hair right
          top: 13px;
          right: -16px;
          width: 25px;
          height: 100px;
          border-top-left-radius: 15px;
          border-top-right-radius: 34px;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 100px;
          transform: rotate(-10deg);
        }
      }
      .beard {
        top: 64px;
        left: 5px;
        border-top: 80px solid $hair;
        border-left: 35px solid transparent;
        border-right: 35px solid transparent;
        border-radius: 30px;

        &::before {
          // mouth
          content: '';
          position: absolute;
          background-color: $lips;
          width: 20px;
          height: 5px;
          border-radius: 40%;
          top: -70px;
          left: -9px;
        }
      }
    }
  }
}
</style>
