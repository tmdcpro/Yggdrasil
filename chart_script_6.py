# Since mermaid is having network issues, create a CI/CD pipeline visualization using Plotly
import plotly.graph_objects as go
import plotly.express as px

# Create a flowchart-style CI/CD pipeline using plotly
fig = go.Figure()

# Define the pipeline steps and their positions
steps = [
    {"name": "Code Push", "x": 1, "y": 10, "type": "start"},
    {"name": "GitHub Actions", "x": 1, "y": 9, "type": "process"},
    {"name": "Build", "x": 1, "y": 8, "type": "process"},
    {"name": "Tests", "x": 1, "y": 7, "type": "process"},
    {"name": "Pass?", "x": 1, "y": 6, "type": "decision"},
    {"name": "Failed", "x": 0, "y": 5, "type": "end"},
    {"name": "Docker Build", "x": 1, "y": 5, "type": "process"},
    {"name": "Push Registry", "x": 1, "y": 4, "type": "process"},
    {"name": "K8s Staging", "x": 1, "y": 3, "type": "process"},
    {"name": "Stage Tests", "x": 1, "y": 2, "type": "process"},
    {"name": "OK?", "x": 1, "y": 1, "type": "decision"},
    {"name": "Rollback Stage", "x": 0, "y": 0, "type": "process"},
    {"name": "K8s Prod", "x": 1, "y": 0, "type": "process"},
    {"name": "Monitor", "x": 1, "y": -1, "type": "process"},
    {"name": "Issues?", "x": 1, "y": -2, "type": "decision"},
    {"name": "Complete", "x": 2, "y": -3, "type": "end"},
    {"name": "Rollback Prod", "x": 0, "y": -3, "type": "process"},
    {"name": "Restore", "x": 0, "y": -4, "type": "process"}
]

# Define colors for different step types
colors = {
    "start": "#1FB8CD",
    "process": "#2E8B57", 
    "decision": "#DB4545",
    "end": "#5D878F"
}

# Add nodes
for step in steps:
    fig.add_trace(go.Scatter(
        x=[step["x"]], 
        y=[step["y"]], 
        mode='markers+text',
        marker=dict(
            size=60,
            color=colors[step["type"]],
            line=dict(width=2, color='white')
        ),
        text=step["name"],
        textposition="middle center",
        textfont=dict(size=10, color='white'),
        showlegend=False,
        hoverinfo='text',
        hovertext=step["name"]
    ))

# Add arrows/connections
connections = [
    (0, 1), (1, 2), (2, 3), (3, 4), (4, 5), (4, 6), (6, 7), (7, 8), (8, 9), 
    (9, 10), (10, 11), (10, 12), (12, 13), (13, 14), (14, 15), (14, 16), (16, 17)
]

for start_idx, end_idx in connections:
    start = steps[start_idx]
    end = steps[end_idx]
    
    fig.add_trace(go.Scatter(
        x=[start["x"], end["x"]], 
        y=[start["y"], end["y"]], 
        mode='lines',
        line=dict(width=2, color='gray'),
        showlegend=False,
        hoverinfo='skip'
    ))

# Update layout
fig.update_layout(
    title="CI/CD Pipeline Flow",
    xaxis=dict(
        showgrid=False,
        zeroline=False,
        showticklabels=False,
        range=[-0.5, 2.5]
    ),
    yaxis=dict(
        showgrid=False,
        zeroline=False,
        showticklabels=False,
        range=[-5, 11]
    ),
    plot_bgcolor='white',
    showlegend=False
)

# Save the chart
fig.write_image("cicd_pipeline.png")
fig.write_image("cicd_pipeline.svg", format="svg")

print("CI/CD Pipeline chart saved successfully as PNG and SVG")