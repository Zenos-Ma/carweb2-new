<template>
  <section class="leader-model1">
    <div class="model-title">
      <span @click="changeUser">{{ modelTitle }}</span>
    </div>
    <div class="model-content">
      <div
        class="model1-card card1"
        style="width:calc(25% - 8px);left:8px;height:calc(33% - 8px);"
      >
        <div class="card-header">{{ $t("deviceChart.chart1Title") }}</div>
        <div class="card-content" id="model1_chart1"></div>
      </div>

      <div
        class="model1-card card1"
        style="width:calc(25% - 8px);left:8px;top:33% ;height:calc(33% - 8px);"
      >
        <div class="card-header">{{ $t("deviceChart.chart2Title") }}</div>
        <div class="card-content" id="model1_chart2"></div>
      </div>

      <div
        class="model1-card"
        style="width:calc(50% - 16px);left:calc(25% + 8px);height:calc(66% - 8px);"
      >
        <div class="card-header model1-emphasis">
          <span>{{ $t("deviceChart.devsNum") }}</span>
        </div>
        <div class="card-content" id="model1_chart3"></div>
      </div>

      <div
        class="model1-card card3"
        style="width:calc(75% - 16px);left:8px;top:66%;height:calc(34% - 8px);"
      >
        <div class="card-header">{{ $t("deviceChart.devsInstall") }}</div>
        <div class="card-content" id="model1_chart6"></div>
      </div>

      <div
        class="model1-card card2"
        style="width:calc(25% - 8px);right:8px;height:calc(33% - 8px);"
      >
        <div class="card-header">{{ $t("deviceChart.devsType") }}</div>
        <div class="card-content" id="model1_chart4"></div>
      </div>
      <div
        class="model1-card card2"
        style="width:calc(25% - 8px);right:8px;top:33%;height:calc(33% - 8px);"
      >
        <div class="card-header">{{ $t("deviceChart.devsStatus") }}</div>
        <div class="card-content" id="model1_chart5"></div>
      </div>

      <div
        class="model1-card card2"
        style="width:calc(25% - 8px);right:8px;top:66%;height:calc(34% - 8px);"
      >
        <div class="card-header">{{ $t("deviceChart.devsStatus1") }}</div>
        <div class="card-content" id="model1_chart7"></div>
      </div>
    </div>
    <select-user-dialog
      @select-user-result="selectUserResult"
    ></select-user-dialog>
  </section>
</template>
<script src="./deviceChart.js"></script>
<style lang="scss" scoped>
$fontS: 12px;
$fontM: 14px;
$fontL: 16px;
$fontXL: 20px;
$fontXXL: 24px;
$imgPath: "~@/assets/img/";
//模板1布局
$model1_bg: rgba(91, 92, 110, 0.5);
$model1_card1Border: #0099ff;
//$model1_titleBorder:
$model1_card1Border_w: 3px;
.leader-model1 {
  display: flex;
  flex-direction: column;
  background-image: url($imgPath+"bg/model1bg-1.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
  .model-title {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    > span {
      font-weight: bold;
      color: white;
      display: inline-flex;
      justify-content: center;
      white-space: nowrap;
      align-items: center;
      position: absolute;
      line-height: 40px;
      font-size: 30px;
      background-color: $model1_bg;
      width: 600px;
      text-align: center;
    }
    > span::after {
      display: inline-block;
      content: "";
      width: 40px;
      height: 40px;

      position: absolute;
      right: -40px;
      background-image: linear-gradient(
        135deg,
        $model1_bg 50%,
        transparent 50%
      );
    }
    > span::before {
      display: inline-block;
      position: absolute;
      left: -40px;
      content: "";
      width: 40px;
      height: 40px;
      background-image: linear-gradient(
        225deg,
        $model1_bg 50%,
        transparent 50%
      );
    }
  }
  .model-title::before {
    display: inline-block;

    position: absolute;
    width: calc(50% - 400px);
    content: "";

    border-bottom: dotted 8px $model1_bg;
    left: 0;
  }
  .model-title::after {
    display: inline-block;

    position: absolute;
    width: calc(50% - 400px);
    content: "";
    right: 0;

    border-bottom: dotted 8px $model1_bg;
  }

  .model-content {
    display: flex;
    width: 100%;
    position: absolute;
    flex-direction: row;
    top: 40px;
    height: calc(100% - 40px);
  }
}
.model1-card .card-header.model1-emphasis {
  font-weight: bold;
  font-size: $fontXL;
  color: yellow;
  > span {
    position: absolute;
    margin-top: 40px;
    margin-left: 40px;
  }
}

//图表卡片
.model1-card {
  width: calc(100% - 16px);
  display: inline-flex;
  flex-direction: column;
  position: absolute;
  .card-header {
    color: white;
    line-height: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    flex-direction: row;
    white-space: nowrap;
  }
  .card-content {
    white-space: nowrap;
    display: flex;
    width: 100%;
    height: calc(100% - 30px);
  }
}

.model1-card.card1 {
  background: $model1_bg;
  .card-header {
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.2) 30%,
      transparent
    );
    font-size: 20px;
    padding: 0 8px;
    font-weight: bold;
  }
}
.model1-card.card1::before {
  border-right: solid 1px $model1_card1Border;
  border-top: solid 1px $model1_card1Border;
  height: $model1_card1Border_w;
  width: $model1_card1Border_w;
  position: absolute;
  right: 0;
  top: 0;
  content: "";
}
.model1-card.card1::after {
  border-bottom: solid 1px $model1_card1Border;
  border-right: solid 1px $model1_card1Border;
  height: $model1_card1Border_w;
  width: $model1_card1Border_w;
  position: absolute;
  right: 0;
  bottom: 0;
  content: "";
}

.model1-card.card2 {
  background: $model1_bg;
  .card-header {
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.2) 30%,
      transparent
    );
    font-size: 20px;
    padding: 0 8px;
    font-weight: bold;
  }
  .card-header {
    flex-direction: row-reverse;
    background-image: linear-gradient(
      to left,
      rgba(255, 255, 255, 0.2) 30%,
      transparent
    );
  }
}

.model1-card.card2::before {
  border: none;
  border-left: solid 1px $model1_card1Border;
  border-top: solid 1px $model1_card1Border;
  height: $model1_card1Border_w;
  width: $model1_card1Border_w;
  position: absolute;
  left: 0;
  top: 0;
  content: "";
}
.model1-card.card2::after {
  border: none;
  border-bottom: solid 1px $model1_card1Border;
  border-left: solid 1px $model1_card1Border;
  height: $model1_card1Border_w;
  width: $model1_card1Border_w;
  position: absolute;
  left: 0;
  bottom: 0;
  content: "";
}

.model1-card.card3 {
  background: $model1_bg;
  .card-header {
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.2) 30%,
      transparent
    );
    font-size: 20px;
    padding: 0 8px;
    font-weight: bold;
  }
  .card-header {
    justify-content: center;
    background-image: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.2) 40%,
      rgba(255, 255, 255, 0.2) 60%,
      transparent
    );
  }
  .card-content::before {
    border: none;
    border-left: solid 1px $model1_card1Border;
    border-bottom: solid 1px $model1_card1Border;
    height: $model1_card1Border_w;
    width: $model1_card1Border_w;
    position: absolute;
    left: 0;
    bottom: 0;
    content: "";
  }

  .card-content::after {
    border: none;
    border-right: solid 1px $model1_card1Border;
    border-bottom: solid 1px $model1_card1Border;
    height: $model1_card1Border_w;
    width: $model1_card1Border_w;
    position: absolute;
    right: 0;
    bottom: 0;
    content: "";
  }
}
.model1-card.card3::after {
  border: none;
  border-left: solid 1px $model1_card1Border;
  border-top: solid 1px $model1_card1Border;
  height: $model1_card1Border_w;
  width: $model1_card1Border_w;
  position: absolute;
  left: 0;
  top: 0;
  content: "";
}
</style>
