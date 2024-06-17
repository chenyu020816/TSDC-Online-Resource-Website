# Online Resource Website

## Create Website
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