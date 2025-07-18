const https = require('http');

async function testPerformance(url, iterations = 5) {
  const results = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      const duration = Date.now() - start;
      results.push(duration);
      console.log(`Test ${i + 1}: ${duration}ms`);
    } catch (error) {
      console.error(`Test ${i + 1} failed:`, error.message);
    }
  }
  
  const average = results.reduce((a, b) => a + b, 0) / results.length;
  const min = Math.min(...results);
  const max = Math.max(...results);
  
  return {
    average: Math.round(average),
    min,
    max,
    results
  };
}

async function main() {
  console.log('Testing API performance...\n');
  
  const baselineResults = await testPerformance('http://localhost:3000/api/users');
  
  console.log('\n=== Performance Results ===');
  console.log(`Average: ${baselineResults.average}ms`);
  console.log(`Min: ${baselineResults.min}ms`);
  console.log(`Max: ${baselineResults.max}ms`);
  console.log(`Results: ${baselineResults.results.join(', ')}ms`);
}

main().catch(console.error);