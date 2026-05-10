// using native fetch

async function testRaceCondition() {
  console.log("Testing Race Condition on localhost:3000...");
  
  // 1. Get a session cookie first
  let res = await fetch("http://localhost:3000/api/labs/a06-3/redeem", {
    method: "POST"
  });
  const cookie = res.headers.get("set-cookie").split(';')[0];
  console.log("Got session cookie:", cookie);
  
  // Reset session to clean state (optional, just to be sure we start fresh)
  // Actually, let's just make a new request with a dummy cookie to force a new session
  const dummyCookie = `lab-session=test-race-${Date.now()}`;
  
  console.log(`Sending 10 concurrent requests with ${dummyCookie}`);
  
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(
      fetch("http://localhost:3000/api/labs/a06-3/redeem", {
        method: "POST",
        headers: {
          "Cookie": dummyCookie
        }
      }).then(r => r.json())
    );
  }
  
  const results = await Promise.all(promises);
  console.log("Results:");
  results.forEach((r, i) => {
    console.log(`Req ${i+1}: Success=${r.success}, Balance=${r.balance}, Msg=${r.message}`);
  });
}

testRaceCondition();
