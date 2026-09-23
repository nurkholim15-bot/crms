package decisionengine

import (
	"testing"
)

func TestDecisionEngineRules(t *testing.T) {
	engine := NewEngine()

	// 1. Test VIP -> Special Team
	resVIP := engine.Evaluate(5, 800, true, false, 1)
	if resVIP.ActionPath != "VIP" || resVIP.AssignedPIC != PIC_SPECIAL_TEAM {
		t.Errorf("Expected VIP to have ActionPath 'VIP' and PIC 'Special Team', got AP: %s, PIC: %s", resVIP.ActionPath, resVIP.AssignedPIC)
	}

	// 2. Test Grade 3 (Low Risk variant 1):
	// DPD 2 -> WA
	resLow2 := engine.Evaluate(2, 750, false, false, 1)
	if resLow2.ActionPath != "3" || resLow2.AssignedPIC != PIC_WA {
		t.Errorf("Expected Grade 3 DPD 2 to have PIC WA, got AP: %s, PIC: %s", resLow2.ActionPath, resLow2.AssignedPIC)
	}

	// DPD 6 -> Robot
	resLow6 := engine.Evaluate(6, 750, false, false, 1)
	if resLow6.ActionPath != "3" || resLow6.AssignedPIC != PIC_ROBOT {
		t.Errorf("Expected Grade 3 DPD 6 to have PIC Robot, got AP: %s, PIC: %s", resLow6.ActionPath, resLow6.AssignedPIC)
	}

	// DPD 20 -> DC
	resLow20 := engine.Evaluate(20, 750, false, false, 1)
	if resLow20.ActionPath != "3" || resLow20.AssignedPIC != PIC_DC {
		t.Errorf("Expected Grade 3 DPD 20 to have PIC DC, got AP: %s, PIC: %s", resLow20.ActionPath, resLow20.AssignedPIC)
	}

	// 3. Test Grade 7 (High Risk variant 1):
	// DPD 2 -> FC
	resHigh2 := engine.Evaluate(2, 300, false, false, 1)
	if resHigh2.ActionPath != "7" || resHigh2.AssignedPIC != PIC_FC {
		t.Errorf("Expected Grade 7 DPD 2 to have PIC FC, got AP: %s, PIC: %s", resHigh2.ActionPath, resHigh2.AssignedPIC)
	}

	// DPD 20 -> SFC
	resHigh20 := engine.Evaluate(20, 300, false, false, 1)
	if resHigh20.ActionPath != "7" || resHigh20.AssignedPIC != PIC_SFC {
		t.Errorf("Expected Grade 7 DPD 20 to have PIC SFC, got AP: %s, PIC: %s", resHigh20.ActionPath, resHigh20.AssignedPIC)
	}

	// 4. Test >30 DPD (Senior Field Collector across all grades)
	// DPD 45 -> Senior Field Collector
	res45 := engine.Evaluate(45, 600, false, false, 1)
	if res45.Bucket != Bucket31To60 || res45.AssignedPIC != PIC_SENIOR_FIELD {
		t.Errorf("Expected DPD 45 to have Bucket 31-60 and PIC Senior Field Collector, got Bucket: %s, PIC: %s", res45.Bucket, res45.AssignedPIC)
	}

	// DPD 90 -> Senior Field Collector
	res90 := engine.Evaluate(90, 600, false, false, 1)
	if res90.Bucket != Bucket61To150 || res90.AssignedPIC != PIC_SENIOR_FIELD {
		t.Errorf("Expected DPD 90 to have Bucket 61-150 and PIC Senior Field Collector, got Bucket: %s, PIC: %s", res90.Bucket, res90.AssignedPIC)
	}

	// DPD 160 -> Senior Field Collector
	res160 := engine.Evaluate(160, 600, false, false, 1)
	if res160.Bucket != BucketOver150 || res160.AssignedPIC != PIC_SENIOR_FIELD {
		t.Errorf("Expected DPD 160 to have Bucket > 150 and PIC Senior Field Collector, got Bucket: %s, PIC: %s", res160.Bucket, res160.AssignedPIC)
	}
}
