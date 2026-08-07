import React, { useState, useEffect } from 'react';

const pinCache: Record<string, string> = {};

export default function PinLocation({ pin }: { pin: string }) {
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    if (!pin) return;
    if (pinCache[pin]) {
      setLocation(pinCache[pin]);
      return;
    }
    fetch(`https://api.postalpincode.in/pincode/${pin}`)
      .then(r => r.json())
      .then(data => {
        if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const loc = `${po.District || po.Name}, ${po.State}`;
          pinCache[pin] = loc;
          setLocation(loc);
        }
      })
      .catch((err) => console.error("Failed to fetch pin location:", err));
  }, [pin]);

  if (!location) return <span>{pin}</span>;
  return <span>{pin} ({location})</span>;
}
