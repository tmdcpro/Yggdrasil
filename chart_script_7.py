import plotly.graph_objects as go
import numpy as np

# Create a proper flowchart diagram using Plotly with better layout and arrows
fig = go.Figure()

# Define node positions with better spacing for a flowchart layout
nodes = {
    'A': {'pos': (5, 12), 'text': 'Start Project', 'type': 'start'},
    'B': {'pos': (5, 10.5), 'text': 'Create Checkpoint', 'type': 'process'},
    'C': {'pos': (5, 9), 'text': 'Tag Checkpoint', 'type': 'process'},
    'D': {'pos': (5, 7.5), 'text': 'Store Metadata', 'type': 'process'},
    'E': {'pos': (5, 6), 'text': 'Generate Logs', 'type': 'process'},
    'F': {'pos': (5, 4.5), 'text': 'Create Docs', 'type': 'process'},
    'G': {'pos': (5, 3), 'text': 'Human Review', 'type': 'process'},
    'H': {'pos': (5, 1.5), 'text': 'Review OK?', 'type': 'decision'},
    'I': {'pos': (8, 0), 'text': 'Checkpoint Ready', 'type': 'process'},
    'J': {'pos': (2, 0), 'text': 'Update & Retry', 'type': 'process'},
    'K': {'pos': (8, -1.5), 'text': 'Store in Repo', 'type': 'process'},
    'L': {'pos': (8, -3), 'text': 'Restore Request', 'type': 'process'},
    'M': {'pos': (8, -4.5), 'text': 'Validate Point', 'type': 'process'},
    'N': {'pos': (8, -6), 'text': 'Restore State', 'type': 'process'},
    'O': {'pos': (8, -7.5), 'text': 'End', 'type': 'end'}
}

# Colors for different node types
colors = {
    'start': '#1FB8CD',
    'process': '#2E8B57', 
    'decision': '#DB4545',
    'end': '#5D878F'
}

# Add nodes with better sizing
for node_id, node_info in nodes.items():
    x, y = node_info['pos']
    node_type = node_info['type']
    
    # Different shapes for different node types
    if node_type == 'decision':
        # Diamond shape for decision nodes
        fig.add_shape(
            type="rect",
            x0=x-0.8, y0=y-0.4, x1=x+0.8, y1=y+0.4,
            fillcolor=colors[node_type],
            line=dict(color="black", width=2),
            opacity=0.9
        )
    else:
        # Rectangle for other nodes
        width = 1.2 if node_type in ['start', 'end'] else 1.0
        fig.add_shape(
            type="rect",
            x0=x-width, y0=y-0.4, x1=x+width, y1=y+0.4,
            fillcolor=colors[node_type],
            line=dict(color="black", width=2),
            opacity=0.9
        )
    
    # Add text with larger font
    fig.add_annotation(
        x=x, y=y,
        text=node_info['text'],
        showarrow=False,
        font=dict(color="white", size=12, family="Arial Black"),
        xanchor="center",
        yanchor="middle"
    )

# Add connecting arrows with better styling
def add_arrow(start_node, end_node, label=""):
    start_pos = nodes[start_node]['pos']
    end_pos = nodes[end_node]['pos']
    
    fig.add_annotation(
        x=end_pos[0],
        y=end_pos[1] + 0.4,
        ax=start_pos[0],
        ay=start_pos[1] - 0.4,
        arrowhead=2,
        arrowsize=1.5,
        arrowwidth=3,
        arrowcolor="black"
    )
    
    # Add label if provided
    if label:
        mid_x = (start_pos[0] + end_pos[0]) / 2
        mid_y = (start_pos[1] + end_pos[1]) / 2
        fig.add_annotation(
            x=mid_x + 0.3,
            y=mid_y,
            text=label,
            showarrow=False,
            font=dict(size=11, color="black", family="Arial Bold"),
            bgcolor="white",
            bordercolor="black",
            borderwidth=1
        )

# Add straight flow arrows
straight_connections = [
    ('A', 'B'), ('B', 'C'), ('C', 'D'), ('D', 'E'), 
    ('E', 'F'), ('F', 'G'), ('G', 'H'),
    ('I', 'K'), ('K', 'L'), ('L', 'M'), ('M', 'N'), ('N', 'O')
]

for start, end in straight_connections:
    add_arrow(start, end)

# Add decision branch arrows with labels
add_arrow('H', 'I', 'Yes')
add_arrow('H', 'J', 'No')

# Add curved return arrow from J back to C
fig.add_annotation(
    x=4.2, y=9,
    ax=2.8, ay=0,
    arrowhead=2,
    arrowsize=1.5,
    arrowwidth=3,
    arrowcolor="red",
    standoff=5
)

# Add curved arrow path visualization
x_curve = np.linspace(2, 4.2, 50)
y_curve = 0 + 9 * (x_curve - 2) / 2.2 - 2 * ((x_curve - 2) / 2.2) ** 2

fig.add_trace(go.Scatter(
    x=x_curve,
    y=y_curve,
    mode='lines',
    line=dict(color='red', width=3, dash='dot'),
    showlegend=False,
    hoverinfo='skip'
))

# Update layout for better presentation
fig.update_layout(
    title="Project Checkpoint Workflow",
    showlegend=False,
    xaxis=dict(
        range=[0, 10],
        showgrid=False,
        showticklabels=False,
        zeroline=False
    ),
    yaxis=dict(
        range=[-8.5, 13],
        showgrid=False,
        showticklabels=False,
        zeroline=False
    ),
    plot_bgcolor='white',
    paper_bgcolor='white',
    font=dict(family="Arial", size=12)
)

# Save the chart
fig.write_image("checkpoint_workflow.png")
fig.write_image("checkpoint_workflow.svg", format="svg")

print("Enhanced flowchart saved successfully as PNG and SVG")