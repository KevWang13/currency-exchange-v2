// resetAdminPassword.js
const bcrypt = require('bcryptjs');
const pool = require('./config/db'); // Adjust path if needed

async function resetAdminPassword(newPassword) {
  try {
    const hash = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query(
      'UPDATE users SET password_hash = ? WHERE username = ?',
      [hash, 'admin']
    );
    console.log(`Admin password updated successfully. Rows affected: ${result.affectedRows}`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to reset admin password:', err);
    process.exit(1);
  }
}

// Replace 'adminpass' with your desired new password
resetAdminPassword('adminpass');
