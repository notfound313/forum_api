# Forum API

**Forum API** adalah aplikasi backend untuk sistem forum, yang memungkinkan pengguna untuk membuat thread, memberikan like pada komentar, serta berbagai fitur lainnya. Proyek ini dibangun dengan prinsip _Test-Driven Development_ (TDD) dan dilengkapi dengan berbagai teknologi dan fitur modern untuk menjamin keamanan, skalabilitas, dan performa yang optimal.

## Fitur Utama

- **Create Thread**: Pengguna dapat membuat thread baru di forum.
- **Create Comment**: Pengguna dapat membuat komentar baru di forum.
- **Create Reply**: Pengguna dapat membuat Reply baru di forum.
- **Like Comment**: Pengguna dapat memberikan like pada komentar dalam thread.
- **CI/CD**: Proyek ini menggunakan Continuous Integration dan Continuous Deployment untuk memastikan pengujian yang baik dan proses pengiriman kode yang otomatis.
- **Nginx Reverse Proxy**: Server menggunakan Nginx sebagai reverse proxy untuk distribusi trafik yang lebih efisien.
- **Mencegah Ancaman DDoS**: Tindakan pencegahan DDoS dengan pengaturan dan pengoptimalan Nginx dan aplikasi.
- **SSL (Secure Sockets Layer)**: Proyek ini dilindungi dengan SSL untuk enkripsi data dan komunikasi yang aman.
- **Deployment di AWS**: Aplikasi dideploy di AWS untuk skalabilitas yang tinggi dan pengelolaan infrastruktur yang mudah.

## Teknologi yang Digunakan

- **HAPI.js**: Framework untuk membangun API.
- **PostgreSQL**: Database relasional untuk menyimpan data thread dan komentar.
- **Jest**: Framework untuk pengujian dengan pendekatan TDD.
- **Nginx**: Reverse proxy dan pengaturan server.
- **AWS**: Untuk deployment dan infrastruktur cloud.


## Setup Proyek

### Persyaratan

1. **Node.js & npm**: Pastikan Node.js dan npm sudah terinstal di sistem Anda.
2. **PostgreSQL**: Pastikan PostgreSQL terinstal atau Anda dapat menggunakan PostgreSQL yang dikelola di cloud ( AWS RDS).
3. **AWS CLI**: Untuk deploy ke AWS.

### Instalasi

1. Clone repository:
   ```bash
   git clone https://github.com/username/forum-api.git
   cd forum-api