# 🔍 Hướng Dẫn Xử Lý Vấn Đề Login

## 📋 Vấn Đề Hiện Tại
1. ✅ Login đăng nhập thành công nhưng không lấy được token từ BE
2. ❌ Không xác định được role của user
3. ❌ "Đăng bài" không hiện trên menu tab

## 🔧 Các Bước Đã Sửa

### 1. **Cập Nhật Login.jsx** 
   - Thêm console logs chi tiết để debug
   - Hỗ trợ nhiều format response từ BE:
     - `response.data.token` hoặc `response.data.accessToken`
     - `response.data.user` hoặc `response.data.data`
   - Nếu không có user/data, sẽ lưu toàn bộ response.data

### 2. **Cập Nhật Header.jsx**
   - Thêm state `user` từ localStorage
   - Check admin role linh hoạt hơn:
     ```javascript
     user.roleID === 1 || 
     user.roleId === 1 ||    // Trường hợp khác nhau
     user.role === 'Admin' || 
     user.role === 'admin'
     ```
   - Hiển thị user name từ nhiều field khác nhau:
     - `fullName`, `username`, `email`, `name`
   - Hiển thị role từ: `role` hoặc `roleType`

### 3. **Cập Nhật App.jsx**
   - Thêm import `ImportPage`
   - Đổi route từ `/options-template` sang `/curriculum`
   - Thêm route `/import` cho ImportPage

## 🔍 Các Console Logs Để Debug

Khi login, hãy mở DevTools (F12) và xem console:

```
📤 Sending login request: { email, password }
📥 Login response full: [toàn bộ response]
📥 Response keys: [các key trong response]
🔍 Token: [token value hoặc undefined]
✅ Token saved: [token value]
🔍 User data to save: [user object]
✅ User saved: [user object]
```

Khi load Header, xem:
```
🔍 Header - User: [user object]
🔍 Header - Is Admin: [true/false]
🔍 Header - User roleID: [value]
🔍 Header - User roleId: [value]
🔍 Header - User role: [value]
```

## ✅ Kiểm Tra Từng Bước

1. **Mở browser DevTools** (F12)
2. **Vào tab Console**
3. **Login bằng tài khoản admin**
4. **Kiểm tra các logs:**
   - Token có được lưu không?
   - User object có chứa role/roleID không?
5. **Refresh page (F5)**
6. **Kiểm tra:**
   - Header hiển thị user name không?
   - Menu "Đăng bài" (📝) có hiển thị không?

## 🎯 Cách Fix Nếu Vẫn Không Hoạt Động

### Nếu Token Không Lưu Được
- Kiểm tra response từ BE có chứa gì?
- Có thể là `accessToken`, `jwt`, `bearer`, v.v.
- Update Login.jsx để handle tên field mới:
  ```javascript
  const token = response.data.token || 
               response.data.accessToken || 
               response.data.jwt ||
               response.data.bearer
  ```

### Nếu Không Xác Định Role
- Kiểm tra user object từ console
- Có thể là `roleID`, `role`, `roleType`, `userRole`
- Update Header.jsx để check tất cả:
  ```javascript
  const roleId = user?.roleID || user?.roleId || user?.roleType
  const isAdmin = roleId === 1 || user?.role?.toLowerCase() === 'admin'
  ```

### Nếu Menu Không Hiển Thị
- Đảm bảo token được lưu vào localStorage
- Refresh page để reload Header
- Kiểm tra isAdmin trong Header console logs

## 📍 Các File Đã Sửa

| File | Sửa |
|------|-----|
| `src/pages/AuthPage/Login/Login.jsx` | ✅ Thêm debug logs, hỗ trợ nhiều response format |
| `src/components/Layout/Header/Header.jsx` | ✅ Thêm user state, admin check, user display |
| `src/components/Layout/Header/Header.css` | ✅ Thêm user-menu styles |
| `src/App.jsx` | ✅ Thêm ImportPage route, fix curriculum path |
| `src/services/api.js` | ✅ Resolve conflict, thêm admin APIs |

## 🚀 Lệnh Chạy App

```bash
# Terminal 1 - Dev Server
npm run dev

# Terminal 2 - Watch Console
F12 -> Console tab

# Login và kiểm tra logs
```

## 💡 Tips
- Sử dụng `localStorage.getItem('user')` trong console để xem user object
- Sử dụng `localStorage.getItem('authToken')` để xem token
- Refresh page nếu Header chưa update sau khi login
