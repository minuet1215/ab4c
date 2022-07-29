import * as tf from "@tensorflow/tfjs";
const bodyPix = require("@tensorflow-models/body-pix");
async function BackgroundRemoval(canvas) {
  const net = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multipiler: 0.75,
    quantBytes: 2,
  });
  const segmentation = await net.segmentPerson(canvas, {
    internalResolution: "medium",
  });

  const ctx = canvas.getContext("2d");
  const { data: imgData } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const newImg = ctx.createImageData(canvas.width, canvas.height);
  const newImgData = newImg.data;

  segmentation.data.forEach((segment, i) => {
    if (segment == 1) {
      newImgData[i * 4] = imgData[i * 4];
      newImgData[i * 4 + 1] = imgData[i * 4 + 1];
      newImgData[i * 4 + 2] = imgData[i * 4 + 2];
      newImgData[i * 4 + 3] = imgData[i * 4 + 3];
    }
  });

  await ctx.putImageData(newImg, 0, 0);
}
async function Nooki(canvas, ctx) {
  try {
    const _id = await ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = _id.data;

    let arr = [];
    let idx = 0;
    for (let i = 0; i < canvas.height; i++) {
      let arrayOfImgInRow = [];
      for (let j = 0; j < canvas.width; j++) {
        let arrayOfRgb = [];
        for (let k = 0; k < 4; k++) {
          arrayOfRgb.push(_id.data[idx++]);
        }
        arrayOfImgInRow.push(arrayOfRgb);
      }
      arr.push(arrayOfImgInRow);
    }

    let visited = [];
    for (let i = 0; i < arr.length; i++) {
      let tmp = [];
      for (let j = 0; j < arr[0].length; j++) {
        tmp.push(false);
      }
      visited.push(tmp);
    }
    await stack_DFS(0, 0);
    await stack_DFS(0, canvas.width - 1);
    await stack_DFS(canvas.height - 1, canvas.width - 1);
    await stack_DFS(canvas.height - 1, 0);

    async function stack_DFS(x, y) {
      let queue = [];
      queue.push([x, y]);

      while (queue.length > 0) {
        let [current_x, current_y] = queue.pop();
        visited[current_x][current_y] = true;
        let dir_array = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ];
        for (let i = 0; i < 4; i++) {
          let new_x = current_x + dir_array[i][0];
          let new_y = current_y + dir_array[i][1];
          if (
            0 <= new_x &&
            new_x < arr.length &&
            0 <= new_y &&
            new_y < arr[0].length
          ) {
            if (
              visited[new_x][new_y] === false &&
              arr[new_x][new_y][0] >= arr[current_x][current_y][0] - 1 &&
              arr[new_x][new_y][0] <= arr[current_x][current_y][0] + 1 &&
              arr[new_x][new_y][1] >= arr[current_x][current_y][1] - 1 &&
              arr[new_x][new_y][1] <= arr[current_x][current_y][1] + 1 &&
              arr[new_x][new_y][2] >= arr[current_x][current_y][2] - 1 &&
              arr[new_x][new_y][2] <= arr[current_x][current_y][2] + 1
            ) {
              queue.push([new_x, new_y]);
            }
          }
        }
      }
    }

    let idx_ = 0;
    for (let i = 0; i < canvas.height; i++) {
      for (let j = 0; j < canvas.width; j++) {
        if (visited[i][j]) {
          pixels[idx_] = 0;
          pixels[idx_ + 1] = 0;
          pixels[idx_ + 2] = 0;
          pixels[idx_ + 3] = 0;
        }
        idx_ = idx_ + 4;
      }
    }
    await ctx.putImageData(_id, 0, 0);
    return ctx;
  } catch {
    alert("이미지 업로드에 실패했습니다.");
  }
}

export { BackgroundRemoval, Nooki };
