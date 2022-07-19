let fs = require("fs");
const multer = require("multer");

let dir = "../images"; // 업로드 위치
if (!fs.existsSync(dir)) {
  // 로컬 디렉토리 존재 체크
  fs.mkdirSync(dir, { recursive: true });
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir); //uploads라는 폴더에 file을 저장
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
    //파일이름을 현재시간_파일이름.mp4로 저장하겠다는의미(중복방지)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpeg") {
      //파일확장자는 jpeg만허용 추가하고싶다면 || ext !== '.wmv' 와 같이 가능
      return cb(res.status(400).end("only jpeg is allowd"), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
