#!/usr/bin/env node

const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({
          name,
          address: iface.address,
        });
      }
    }
  }

  return addresses;
}

console.log('\n🌐 Network Access Information\n');
console.log('━'.repeat(50));

const addresses = getLocalIPAddress();

if (addresses.length === 0) {
  console.log('❌ No network interfaces found');
  console.log('   Make sure you are connected to a network');
} else {
  console.log('\n📱 Access from other devices on your network:\n');

  addresses.forEach(({ name, address }) => {
    console.log(`   Interface: ${name}`);
    console.log(`   Local:     http://localhost:3000`);
    console.log(`   Network:   http://${address}:3000`);
    console.log('');
  });

  console.log('━'.repeat(50));
  console.log('\n💡 Tips:');
  console.log('   • Use the Network URL on your phone/tablet');
  console.log('   • Make sure devices are on the same WiFi');
  console.log('   • Check firewall if connection fails\n');
}
