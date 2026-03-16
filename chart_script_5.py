import plotly.graph_objects as go
import plotly.express as px
import networkx as nx

# Since mermaid.ink is not accessible, let's create a network diagram using Plotly
# to show the data flow architecture

# Define nodes and their positions
nodes = {
    'Frontend': (0, 0),
    'Backend': (1, 0),
    'AI Service': (2, 1),
    'Scraping Service': (2, -1),
    'File Upload': (1, 1),
    'AI Tagging': (3, 1.5),
    'Semantic Search': (3, 0.5),
    'Web Scraping': (3, -1.5),
    'Workflow Auto': (1, -0.5)
}

# Define connections (edges)
edges = [
    ('Frontend', 'Backend'),
    ('Backend', 'AI Service'),
    ('Backend', 'Scraping Service'),
    ('Backend', 'File Upload'),
    ('File Upload', 'AI Service'),
    ('AI Service', 'AI Tagging'),
    ('AI Service', 'Semantic Search'),
    ('AI Tagging', 'Backend'),
    ('Semantic Search', 'Backend'),
    ('Scraping Service', 'Web Scraping'),
    ('Web Scraping', 'AI Service'),
    ('Backend', 'Workflow Auto'),
    ('Workflow Auto', 'AI Service'),
    ('Workflow Auto', 'Scraping Service')
]

# Create the figure
fig = go.Figure()

# Add edges (connections)
for edge in edges:
    x0, y0 = nodes[edge[0]]
    x1, y1 = nodes[edge[1]]
    fig.add_trace(go.Scatter(
        x=[x0, x1, None],
        y=[y0, y1, None],
        mode='lines',
        line=dict(color='#5D878F', width=2),
        showlegend=False,
        hoverinfo='none'
    ))

# Add arrow markers for direction
for edge in edges:
    x0, y0 = nodes[edge[0]]
    x1, y1 = nodes[edge[1]]
    # Calculate arrow position (80% of the way to the target)
    arrow_x = x0 + 0.8 * (x1 - x0)
    arrow_y = y0 + 0.8 * (y1 - y0)
    fig.add_annotation(
        x=arrow_x, y=arrow_y,
        ax=x0, ay=y0,
        xref='x', yref='y',
        axref='x', ayref='y',
        showarrow=True,
        arrowhead=2,
        arrowsize=1,
        arrowwidth=2,
        arrowcolor='#5D878F',
        text='',
        bgcolor='rgba(0,0,0,0)'
    )

# Color mapping for different node types
colors = {
    'Frontend': '#1FB8CD',
    'Backend': '#DB4545', 
    'AI Service': '#2E8B57',
    'Scraping Service': '#D2BA4C',
    'File Upload': '#B4413C',
    'AI Tagging': '#964325',
    'Semantic Search': '#944454',
    'Web Scraping': '#13343B',
    'Workflow Auto': '#1FB8CD'
}

# Add nodes
for node, (x, y) in nodes.items():
    fig.add_trace(go.Scatter(
        x=[x],
        y=[y],
        mode='markers+text',
        marker=dict(
            size=25,
            color=colors[node],
            line=dict(width=2, color='white')
        ),
        text=node,
        textposition='middle center',
        textfont=dict(size=10, color='white'),
        name=node,
        showlegend=False,
        hovertemplate=f'<b>{node}</b><extra></extra>'
    ))

# Update layout
fig.update_layout(
    title='Research Data Flow Architecture',
    xaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-0.5, 3.5]
    ),
    yaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-2, 2]
    ),
    plot_bgcolor='white',
    showlegend=False
)

# Save the chart
fig.write_image('data_flow_chart.png')
fig.write_image('data_flow_chart.svg', format='svg')