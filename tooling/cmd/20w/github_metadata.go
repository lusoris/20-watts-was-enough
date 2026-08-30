package main

import (
	"context"
	"fmt"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/githubissuemilestones"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/githublabels"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/githubmilestones"
)

type githubMetadataManifests struct {
	labels     githublabels.Manifest
	milestones githubmilestones.Manifest
	issues     githubissuemilestones.Manifest
}

type githubMetadataOptions struct {
	APIBase    string
	Repository string
	Token      string
}

type githubMetadataResult struct {
	labels     githublabels.Result
	milestones githubmilestones.Result
	issues     githubissuemilestones.Result
}

// syncGitHubMetadata completes every local and remote read-only preflight
// before the first mutation. Successful phases are safe to retain after a
// later transport failure; a fresh preflight makes the retry idempotent.
func syncGitHubMetadata(
	ctx context.Context,
	client interface {
		githublabels.HTTPClient
		githubmilestones.HTTPClient
		githubissuemilestones.HTTPClient
	},
	manifests githubMetadataManifests,
	options githubMetadataOptions,
) (githubMetadataResult, error) {
	labelOptions := githublabels.Options{
		APIBase: options.APIBase, Repository: options.Repository, Token: options.Token,
	}
	milestoneOptions := githubmilestones.Options{
		APIBase: options.APIBase, Repository: options.Repository, Token: options.Token,
	}
	issueOptions := githubissuemilestones.Options{
		APIBase: options.APIBase, Repository: options.Repository, Token: options.Token,
	}

	labelPlan, err := githublabels.Preflight(ctx, client, manifests.labels, labelOptions)
	if err != nil {
		return githubMetadataResult{}, fmt.Errorf("preflight GitHub labels: %w", err)
	}
	milestonePlan, err := githubmilestones.Preflight(ctx, client, manifests.milestones, milestoneOptions)
	if err != nil {
		return githubMetadataResult{}, fmt.Errorf("preflight GitHub milestones: %w", err)
	}
	issuePlan, err := githubissuemilestones.Preflight(
		ctx, client, manifests.issues, issueOptions, milestonePlan,
	)
	if err != nil {
		return githubMetadataResult{}, fmt.Errorf("preflight GitHub issue assignments: %w", err)
	}

	result := githubMetadataResult{}
	result.labels, err = labelPlan.Apply(ctx, client, labelOptions)
	if err != nil {
		return githubMetadataResult{}, fmt.Errorf("apply GitHub labels: %w", err)
	}
	result.milestones, err = milestonePlan.Apply(ctx, client, milestoneOptions)
	if err != nil {
		return githubMetadataResult{}, fmt.Errorf("apply GitHub milestones: %w", err)
	}
	milestoneInventory, err := milestonePlan.Verify(ctx, client, milestoneOptions)
	if err != nil {
		return githubMetadataResult{}, fmt.Errorf("read back GitHub milestones before issue assignment: %w", err)
	}
	result.issues, err = issuePlan.Apply(ctx, client, issueOptions, milestoneInventory)
	if err != nil {
		return githubMetadataResult{}, fmt.Errorf("apply GitHub issue assignments: %w", err)
	}

	if err := labelPlan.Verify(ctx, client, labelOptions); err != nil {
		return githubMetadataResult{}, fmt.Errorf("read back GitHub labels: %w", err)
	}
	finalMilestones, err := milestonePlan.Verify(ctx, client, milestoneOptions)
	if err != nil {
		return githubMetadataResult{}, fmt.Errorf("read back GitHub milestones: %w", err)
	}
	if err := issuePlan.Verify(ctx, client, issueOptions, finalMilestones); err != nil {
		return githubMetadataResult{}, fmt.Errorf("read back GitHub issue assignments: %w", err)
	}
	return result, nil
}
