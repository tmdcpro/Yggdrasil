import plotly.graph_objects as go
import plotly.express as px

# Create a versioning strategy diagram using Plotly
fig = go.Figure()

# Define branch positions
branches = {
    'main': 5,
    'develop': 4, 
    'feature/login': 3,
    'feature/api': 2,
    'hotfix/critical': 1
}

# Define commits and their connections
commits = [
    # Main branch
    {'branch': 'main', 'x': 0, 'commit': 'Initial', 'type': 'commit'},
    {'branch': 'main', 'x': 6, 'commit': 'v1.0.0', 'type': 'tag'},
    {'branch': 'main', 'x': 8, 'commit': 'v1.0.1', 'type': 'hotfix_tag'},
    {'branch': 'main', 'x': 10, 'commit': 'v1.1.0', 'type': 'tag'},
    
    # Develop branch  
    {'branch': 'develop', 'x': 1, 'commit': 'Setup', 'type': 'commit'},
    {'branch': 'develop', 'x': 3, 'commit': 'Integrate', 'type': 'merge'},
    {'branch': 'develop', 'x': 5, 'commit': 'Testing', 'type': 'commit'},
    {'branch': 'develop', 'x': 9, 'commit': 'Pre-release', 'type': 'commit'},
    
    # Feature branches
    {'branch': 'feature/login', 'x': 2, 'commit': 'Login Work', 'type': 'feature'},
    {'branch': 'feature/api', 'x': 7, 'commit': 'API Work', 'type': 'feature'},
    
    # Hotfix branch
    {'branch': 'hotfix/critical', 'x': 7.5, 'commit': 'Critical Fix', 'type': 'hotfix'},
]

# Color mapping for different types
colors = {
    'commit': '#1FB8CD',
    'tag': '#DB4545', 
    'hotfix_tag': '#D2BA4C',
    'merge': '#2E8B57',
    'feature': '#5D878F',
    'hotfix': '#B4413C'
}

# Add commits as scatter points
for commit in commits:
    y_pos = branches[commit['branch']]
    color = colors[commit['type']]
    
    fig.add_trace(go.Scatter(
        x=[commit['x']], 
        y=[y_pos],
        mode='markers+text',
        marker=dict(size=12, color=color),
        text=[commit['commit']],
        textposition='top center',
        showlegend=False,
        hovertext=f"{commit['branch']}: {commit['commit']}",
        hoverinfo='text'
    ))

# Add branch lines
for branch, y_pos in branches.items():
    if branch == 'main':
        x_range = [0, 10]
    elif branch == 'develop': 
        x_range = [1, 9]
    elif branch == 'feature/login':
        x_range = [1.5, 3]
    elif branch == 'feature/api':
        x_range = [6, 9]
    elif branch == 'hotfix/critical':
        x_range = [7, 8]
    
    fig.add_trace(go.Scatter(
        x=x_range,
        y=[y_pos, y_pos],
        mode='lines',
        line=dict(width=3, color='lightgray'),
        showlegend=False,
        hoverinfo='skip'
    ))

# Add merge arrows
merge_arrows = [
    # Feature/login to develop
    {'start': (2, branches['feature/login']), 'end': (3, branches['develop'])},
    # Develop to main (v1.0.0)
    {'start': (5, branches['develop']), 'end': (6, branches['main'])},
    # Hotfix to main
    {'start': (7.5, branches['hotfix/critical']), 'end': (8, branches['main'])},
    # Feature/api to develop  
    {'start': (7, branches['feature/api']), 'end': (9, branches['develop'])},
    # Develop to main (v1.1.0)
    {'start': (9, branches['develop']), 'end': (10, branches['main'])},
]

for arrow in merge_arrows:
    fig.add_annotation(
        x=arrow['end'][0], y=arrow['end'][1],
        ax=arrow['start'][0], ay=arrow['start'][1],
        xref='x', yref='y',
        axref='x', ayref='y',
        arrowhead=2, arrowsize=1, arrowwidth=2,
        arrowcolor='gray',
        showarrow=True
    )

# Update layout
fig.update_layout(
    title="Git Versioning Strategy",
    xaxis=dict(
        title="Timeline",
        showgrid=False,
        zeroline=False,
        range=[-0.5, 10.5]
    ),
    yaxis=dict(
        title="Branches",
        tickvals=list(branches.values()),
        ticktext=list(branches.keys()),
        showgrid=False,
        zeroline=False,
        range=[0.5, 5.5]
    ),
    showlegend=False,
    plot_bgcolor='white'
)

# Save the chart
fig.write_image("versioning_strategy.png")
fig.write_image("versioning_strategy.svg", format="svg")

print("Versioning strategy chart created successfully!")