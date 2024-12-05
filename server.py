from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pyodbc
from datetime import datetime

app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库连接配置
SERVER = 'ALIEN\\SQLEXPRESS'
DATABASE = 'login_db'
conn_str = f'DRIVER={{SQL Server}};SERVER={SERVER};DATABASE={DATABASE};Trusted_Connection=yes;'

# 创建数据模型
class UserLogin(BaseModel):
    email: str
    name: str

# API 路由
@app.post("/api/login")
async def login(user: UserLogin):
    print(f"收到登录请求：email={user.email}, name={user.name}")
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (email, name) VALUES (?, ?)",
            (user.email, user.name)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "登录成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 主页路由
@app.get("/home")
async def home():
    return FileResponse("home.html")

# 静态文件支持 - 放在最后
app.mount("/", StaticFiles(directory="."), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
