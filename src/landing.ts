export const landingPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PropFinance Insight | Global Real Estate Loan Analyzer</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --secondary: #a855f7;
            --bg: #0f172a;
            --card-bg: rgba(30, 41, 59, 0.7);
        }
        body {
            margin: 0;
            font-family: 'Outfit', sans-serif;
            background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
            color: #f8fafc;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow-x: hidden;
        }
        .glass {
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 3rem;
            max-width: 800px;
            width: 90%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            text-align: center;
            animation: fadeIn 1s ease-out;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            background: linear-gradient(to right, #818cf8, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p {
            font-size: 1.2rem;
            color: #94a3b8;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        .feature {
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 16px;
            transition: transform 0.3s ease;
        }
        .feature:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.05);
        }
        .feature h3 {
            color: #818cf8;
            margin-bottom: 0.5rem;
        }
        .feature p {
            font-size: 0.9rem;
            margin: 0;
        }
        .btn {
            display: inline-block;
            margin-top: 2rem;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
        }
        .btn:hover {
            transform: scale(1.05);
            box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.5);
        }
        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: rgba(99, 102, 241, 0.2);
            color: #818cf8;
            border-radius: 999px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="glass">
        <span class="badge">Next-Gen FinTech API</span>
        <h1>PropFinance Insight</h1>
        <p>A deterministic, high-performance API for global real estate loan analysis. Supporting Korean regulations (LTV/DSR) and US Mortgage markets with real-time FRED data.</p>
        
        <div class="grid">
            <div class="feature">
                <h3>Valuation</h3>
                <p>Address-based collateral assessment and KR regulation checks.</p>
            </div>
            <div class="feature">
                <h3>Loan Engine</h3>
                <p>Amortization schedules and DSR calculations with zero latency.</p>
            </div>
            <div class="feature">
                <h3>Bond Analysis</h3>
                <p>NPL/MBS yield (IRR) calculator and risk scoring system.</p>
            </div>
        </div>

        <a href="https://rapidapi.com/" class="btn">Deploy on RapidAPI</a>
    </div>
</body>
</html>
`;
