# Multi-Stream Development Strategy

## Overview

Yggdrasil uses a **multi-stream development model** where different features, approaches, and tech stack variations can be explored in parallel via Git branches and worktrees.

## Branch Naming Convention

```
main                          # Stable release branch
feature/initial-setup         # Default development branch (current base)
experiment/<name>             # Experimental feature branches
experiment/<name>-<variant>   # Variant of an experiment (e.g., experiment/viz-cytoscape, experiment/viz-sigma)
stream/<name>                 # Long-running development streams
```

### Examples

```
experiment/capture-extension-mv3       # Chrome extension using Manifest V3
experiment/capture-extension-sidebar    # Alternative: sidebar-based capture
experiment/viz-cytoscape               # Graph viz with Cytoscape.js
experiment/viz-sigma                   # Graph viz with Sigma.js
experiment/viz-3d-threejs              # 3D graph viz with Three.js
experiment/semantic-semantica          # AI layer using Semantica library
experiment/semantic-langchain          # AI layer using LangChain only
stream/ai-tagging                     # Long-running AI tagging development
stream/graph-engine                   # Long-running graph engine work
```

## Using Git Worktrees for Parallel Development

Git worktrees allow you to have multiple branches checked out simultaneously in different directories:

```bash
# Create a worktree for an experiment (from the repo root)
git worktree add ../Yggdrasil-experiment-viz-sigma experiment/viz-sigma

# List active worktrees
git worktree list

# Remove a worktree when done
git worktree remove ../Yggdrasil-experiment-viz-sigma
```

### Recommended Directory Layout

```
~/projects/
  Yggdrasil/                           # Main working tree (feature/initial-setup)
  Yggdrasil-experiment-viz-sigma/      # Worktree for Sigma.js experiment
  Yggdrasil-experiment-viz-cytoscape/  # Worktree for Cytoscape experiment
  Yggdrasil-stream-ai-tagging/        # Worktree for AI tagging stream
```

## Workflow

### Starting a New Experiment

```bash
# 1. Create the experiment branch from current base
git checkout feature/initial-setup
git checkout -b experiment/my-experiment

# 2. Optionally create a worktree for parallel work
git worktree add ../Yggdrasil-my-experiment experiment/my-experiment

# 3. Work on the experiment
# ... make changes ...

# 4. When ready, create a PR for review/merge
```

### Comparing Experiments

```bash
# Compare two experiment branches
git diff experiment/viz-cytoscape..experiment/viz-sigma

# View divergence from base
git log --oneline feature/initial-setup..experiment/viz-cytoscape
```

### Merging Successful Experiments

```bash
# Cherry-pick specific changes from an experiment
git checkout feature/initial-setup
git cherry-pick <commit-hash>

# Or merge the entire experiment
git merge experiment/successful-experiment
```

### Archiving Completed Experiments

```bash
# Tag for reference, then delete branch
git tag archive/experiment/viz-sigma experiment/viz-sigma
git branch -d experiment/viz-sigma
```

## Guidelines

1. **Keep experiments focused**: Each experiment should test one specific approach or variation
2. **Document findings**: Add a brief `EXPERIMENT.md` in the experiment branch root noting what was tried and outcomes
3. **Share the base scaffold**: All experiments should start from a common scaffold so results are comparable
4. **Don't merge prematurely**: Let experiments run until there's enough data to make a decision
5. **Use PRs for reviews**: Even experiments benefit from code review before merging to main streams
