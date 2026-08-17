# PHP + JSON Music Player + YouTube Search

โปรเจ็กต์นี้เป็นเว็บแอปพลิเคชันที่ทำหน้าที่คล้าย Spotify อย่างง่าย โดยมีฟีเจอร์หลักดังนี้:

- UI แบบ Spotify / แอปฟังเพลงสไตล์สมัยใหม่
- โหลดและแสดง playlist จาก JSON
- เปิดเพลง MP3 ผ่าน HTML5 Audio
- ค้นหาเพลงจาก YouTube และแสดงผลลัพธ์แบบการ์ด
- เปิดเพลง YouTube ผ่าน embedded player
- เพิ่มเพลงใหม่เข้า playlist ได้จากฟอร์ม
- กดหัวใจเพื่อบันทึกเพลงที่ชอบ
- ใช้คิวเพลง (queue) เพื่อให้เพลงเล่นต่อกันได้
- จัดการเพลงที่ชอบและคิวเก็บไว้ใน JSON ไฟล์

## ฟีเจอร์ที่สามารถทำได้

### 1. ฟังเพลง
- เล่นเพลงจากลิงก์ MP3
- ปุ่ม Play / Pause
- ปุ่ม Previous / Next
- แสดงเวลาเพลงแบบ real-time
- ปรับระดับเสียงได้

### 2. จัดการ playlist
- โหลด playlist จากไฟล์ JSON
- เพิ่มเพลงใหม่ผ่านฟอร์ม Add Song
- บันทึก playlist กลับลงไฟล์ JSON

### 3. ค้นหาเพลง
- ค้นหาเพลงจากชื่อเพลง / ศิลปิน / อัลบั้ม
- จัดการการกรองในรายชื่อเพลงทันที

### 4. เพลงที่ชอบ
- กดปุ่มหัวใจเพื่อบันทึกเพลงที่ชอบ
- รายการเพลงที่ชอบแสดงใน sidebar
- เก็บข้อมูลใน `data/favorites.json`

### 5. คิวเพลง
- เพิ่มเพลงเข้า queue ได้จากปุ่ม +
- เมื่อกด Next หรือเพลงจบ จะเล่นเพลงต่อใน queue ก่อน
- ถ้า queue ว่าง จะเล่นลำดับต่อไปตาม playlist

### 6. ค้นหาเพลงจาก YouTube
- ค้นหาเพลงจาก YouTube Data API
- แสดงผลลัพธ์แบบ thumbnail + ชื่อเพลง + ช่องทาง
- กดเลือกเพลงเพื่อเล่นแบบ embedded player

## โครงสร้างไฟล์
- `index.php` — หน้าเว็บหลัก
- `api/playlist.php` — API สำหรับอ่าน/บันทึก playlist
- `api/favorites.php` — API สำหรับเก็บเพลงที่ชอบ
- `api/youtube-search.php` — API สำหรับค้นหา YouTube
- `data/playlist.json` — เก็บข้อมูล playlist
- `data/favorites.json` — เก็บเพลงที่ชอบ
- `assets/css/style.css` — สไตล์ UI แบบ Spotify
- `assets/js/app.js` — จัดการฟังเพลง, queue, favorite, search

## ตัวอย่างโครงสร้าง JSON

### Playlist
```json
{
  "tracks": [
    {
      "id": 1,
      "title": "Midnight City",
      "artist": "M83",
      "album": "Hurry Up, We're Dreaming",
      "duration": "4:18",
      "cover": "https://example.com/cover.jpg",
      "src": "https://example.com/song.mp3"
    }
  ]
}
```

### Favorites
```json
{
  "liked": ["1", "3"]
}
```

## วิธีรัน
1. ติดตั้ง PHP ก่อน
2. เปิด terminal หรือ PowerShell ที่โฟลเดอร์โปรเจ็กต์
3. รันคำสั่ง:

```bash
php -S 127.0.0.1:8000
```

4. เปิดเบราว์เซอร์ที่:

```text
http://127.0.0.1:8000
```

## หมายเหตุ
- หากไม่มี PHP ในเครื่อง จะไม่สามารถรันได้ ต้องติดตั้ง PHP ก่อน
- หากต้องการใช้ YouTube API จริง ต้องตั้งค่า `YOUTUBE_API_KEY`
- ถ้าไม่มีคีย์ ระบบจะใช้ fallback demo result เพื่อให้หน้าแสดงผลได้

## สรุป
โปรเจ็กต์นี้เหมาะสำหรับการเรียนรู้และทดลองทำระบบเพลงออนไลน์แบบง่าย ๆ โดยผสมผสาน:
- HTML + CSS + JS
- PHP API
- JSON storage
- MP3 player
- YouTube search
- Queue และ Favorite list

หากต้องการ ผมสามารถช่วยต่อได้อีก เช่น:
- เพิ่มระบบ Login
- ปรับ UI ให้ใกล้ Spotify อย่างแท้จริง
- เปลี่ยน JSON เป็น MySQL
- เพิ่ม repeat / shuffle
- เพิ่ม upload เพลงจากเครื่องผู้ใช้
