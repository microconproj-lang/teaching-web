#!/usr/bin/env bash
# ============================================================================
# สคริปต์สำรองฐานข้อมูล PostgreSQL รายวันบน Raspberry Pi 5
# ตั้ง Cron เช่น 02:00 น. ทุกวัน:
#   0 2 * * * /path/to/teaching-web/scripts/backup-db.sh >> /var/log/teaching-backup.log 2>&1
# ============================================================================
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/teaching-web}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
CONTAINER_NAME="${POSTGRES_CONTAINER:-teaching_postgres}"
DB_USER="${POSTGRES_USER:-teaching}"
DB_NAME="${POSTGRES_DB:-teaching_web}"
OUT_FILE="${BACKUP_DIR}/teaching_web_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "[$(date -Iseconds)] Starting PostgreSQL backup..."
docker exec "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" "${DB_NAME}" | gzip > "${OUT_FILE}"
echo "[$(date -Iseconds)] Backup saved to ${OUT_FILE}"

# ลบไฟล์ที่เก่ากว่า RETENTION_DAYS วัน
find "${BACKUP_DIR}" -type f -name "teaching_web_*.sql.gz" -mtime "+${RETENTION_DAYS}" -delete

# (Optional) ถ้าตั้งค่า rclone สำหรับ Google Drive ไว้แล้ว ให้เปิดใช้งานบรรทัดด้านล่าง:
# if command -v rclone >/dev/null 2>&1 && [ -n "${RCLONE_REMOTE:-}" ]; then
#   rclone copy "${OUT_FILE}" "${RCLONE_REMOTE}"
#   echo "[$(date -Iseconds)] Uploaded to ${RCLONE_REMOTE}"
# fi

