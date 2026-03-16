import plotly.graph_objects as go
import plotly.express as px

# Create a flowchart using plotly with nodes and connections
# Define node positions and labels for the user flow

nodes = [
    # UI Layer
    {"id": "login", "x": 2, "y": 6, "label": "User Login", "color": "#1FB8CD"},
    {"id": "dashboard", "x": 2, "y": 5, "label": "Dashboard", "color": "#1FB8CD"},
    {"id": "graph_view", "x": 2, "y": 4, "label": "Knowledge Graph", "color": "#1FB8CD"},
    {"id": "search", "x": 0.5, "y": 3, "label": "Search Data", "color": "#DB4545"},
    {"id": "upload", "x": 2, "y": 3, "label": "Upload Content", "color": "#DB4545"},
    {"id": "bookmarks", "x": 3.5, "y": 3, "label": "Manage Bookmarks", "color": "#DB4545"},
    
    # API Layer
    {"id": "search_api", "x": 0.5, "y": 2, "label": "Search API", "color": "#2E8B57"},
    {"id": "upload_api", "x": 2, "y": 2, "label": "Upload API", "color": "#2E8B57"},
    {"id": "bookmark_api", "x": 3.5, "y": 2, "label": "Bookmark API", "color": "#2E8B57"},
    
    # Backend Layer
    {"id": "ai_tagging", "x": 1, "y": 1, "label": "AI Tagging", "color": "#5D878F"},
    {"id": "crud_ops", "x": 2.5, "y": 1, "label": "CRUD Ops", "color": "#5D878F"},
    {"id": "backend", "x": 2, "y": 0.5, "label": "Backend Process", "color": "#D2BA4C"},
    
    # Data Layer
    {"id": "database", "x": 2, "y": 0, "label": "Database", "color": "#B4413C"}
]

# Define connections between nodes
connections = [
    ("login", "dashboard"),
    ("dashboard", "graph_view"),
    ("graph_view", "search"),
    ("graph_view", "upload"),
    ("graph_view", "bookmarks"),
    ("search", "search_api"),
    ("upload", "upload_api"),
    ("bookmarks", "bookmark_api"),
    ("search_api", "backend"),
    ("upload_api", "ai_tagging"),
    ("bookmark_api", "crud_ops"),
    ("ai_tagging", "crud_ops"),
    ("crud_ops", "backend"),
    ("backend", "database"),
    ("database", "graph_view")  # Return loop
]

# Create the figure
fig = go.Figure()

# Add connection lines first (so they appear behind nodes)
node_dict = {node["id"]: node for node in nodes}

for start_id, end_id in connections:
    start_node = node_dict[start_id]
    end_node = node_dict[end_id]
    
    fig.add_trace(go.Scatter(
        x=[start_node["x"], end_node["x"]],
        y=[start_node["y"], end_node["y"]],
        mode='lines',
        line=dict(color='#333333', width=2),
        showlegend=False,
        hoverinfo='none'
    ))
    
    # Add arrow annotation
    fig.add_annotation(
        x=end_node["x"],
        y=end_node["y"],
        ax=start_node["x"],
        ay=start_node["y"],
        xref="x", yref="y",
        axref="x", ayref="y",
        arrowhead=2,
        arrowsize=1,
        arrowwidth=2,
        arrowcolor="#333333",
        showarrow=True,
        text="",
        bgcolor="rgba(0,0,0,0)"
    )

# Add nodes
for node in nodes:
    fig.add_trace(go.Scatter(
        x=[node["x"]],
        y=[node["y"]],
        mode='markers+text',
        marker=dict(
            size=40,
            color=node["color"],
            line=dict(width=2, color='#333333')
        ),
        text=[node["label"]],
        textposition="middle center",
        textfont=dict(size=10, color="white"),
        showlegend=False,
        hoverinfo='text',
        hovertext=node["label"]
    ))

# Update layout
fig.update_layout(
    title="Knowledge Graph User Flow",
    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False, range=[-0.5, 4.5]),
    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False, range=[-0.5, 6.5]),
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)'
)

# Save as both PNG and SVG
fig.write_image("user_flow.png")
fig.write_image("user_flow.svg", format="svg")

print("User flow diagram created successfully!")