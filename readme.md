# Online Resource Website

## Create Website （Backend）

1. 建立資料庫

```sh
docker compose up -d
```

2. 開啟網頁

```sh
docker build -t tsdc_web .
docker run -p 8000:8000 --rm --mount src="$(pwd)",target=/website,type=bind tsdc_web
```

網頁連結 <localhost:8000>

3. 進入資料庫

```sh
docker exec -it tsdc_db mysql -uadmin -ptsdc_web tsdc_web
```

## Create Website （Frontend）

1. 進入前端資料夾

yarn 官方下載：https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable

```sh
cd templates
```

2. 安裝 dependencies

```sh
yarn install
```

3. 啟動

```sh
yarn start
```

4. 封裝

```sh
yarn build
```

> 如果沒有先執行 `yarn build` ，那從後端 `app.py` 啟動的前端畫面會沒有更動。

## 代碼格式

```sh
pip install pre-commit
```

提交代碼時

```
git add .
pre-commit run
git commit ...
```
